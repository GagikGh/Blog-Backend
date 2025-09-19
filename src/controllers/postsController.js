import db from "../../database/db.js";

export const getPosts = async (req, res) => {
    const { search, page = "1", limit = "4" } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    let query = "SELECT * FROM posts ";
    const params = [];

    if (search) {
        query += "WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ?";
        const searchParam = `%${search.toLowerCase()}%`;
        params.push(searchParam, searchParam);
    }

    const [allPosts] = await db.query(query, params);
    const total = allPosts.length;

    const offset = (pageNum - 1) * limitNum;
    const [paginatedItems] = await db.query(
        `${query} ORDER BY created_at DESC LIMIT ${limitNum} OFFSET ${offset}`,[...params,]
    )

    res.json({
        total,
        totalPages: Math.ceil(total / limitNum),
        items: paginatedItems
    });
};

export const getPostById = async (req, res) => {
    const { id } = req.params;

    const [rows] = await db.query(
        `SELECT posts.*, users.first_name AS firstname, users.last_name AS lastname
         FROM posts
                  JOIN users ON posts.user_id = users.id
         WHERE posts.id = ?`,
        [id]
    );
    const postRow = rows[0];

    const [tagsRows] = await db.query(
        `SELECT tags.id, tags.name, tags.color
     FROM tags
     JOIN post_tags ON tags.id = post_tags.tag_id
     WHERE post_tags.post_id = ?`,
        [id]
    );

    const [commentsRows] = await db.query(
        `SELECT
             c.id,
             c.text,
             c.created_at,
             u.first_name AS firstname,
             u.last_name AS lastname,
             c.user_id,
             GROUP_CONCAT(l.user_id) AS likes
         FROM comments c
                  LEFT JOIN likes l ON l.comment_id = c.id
                  JOIN users u ON c.user_id = u.id
         WHERE c.post_id = ?
         GROUP BY c.id
         ORDER BY c.created_at DESC;
        `,
        [id]
    );

    commentsRows.forEach(comment => {
        comment.likes = comment.likes
            ? comment.likes.split(',').map(id => Number(id))
            : [];
    });

    res.json({
        ...postRow,
        tags: tagsRows,
        comments: commentsRows,
    });
};

export const addPost = async (req, res) => {
    const createdAt = Math.floor(Date.now() / 1000);
    const { title, description } = req.body;
    const userId = req.user.id;

    await db.query("INSERT INTO posts (user_id, title, description, created_at) " +
        "VALUES (?, ?, ?, ?);", [ parseInt(userId), title, description, createdAt]);

    res.json({ title, description, createdAt });
};

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    await db.query(
        "UPDATE posts SET title = ?, description = ? WHERE id = ? ",
        [title, description, parseInt(id)]
    );

    res.json({ title, description });
};

export const deletePost = async (req, res) => {
    const { id } = req.params;
    await db.query("DELETE FROM posts WHERE id = ?", [id]);

    res.json({ success: true });
};

export const getPostsByTag = async (req, res) => {
    const { id } =  req.params;
    const [tag] = await db.query("SELECT name, color FROM tags" +
        ` WHERE id = ?;`,[id]);

    const [posts] = await db.query("SELECT posts.title, posts.created_at, posts.description, posts.id, users.first_name, users.last_name FROM posts" +
        " JOIN post_tags ON posts.id = post_tags.post_id" +
        " JOIN users ON posts.user_id = users.id" +
        " WHERE post_tags.tag_id = ?;", [id]);

    const postsByTag = {
        id,
        tag: tag[0],
        posts: [...posts]
    }

    res.json(postsByTag);
};

export const addComment = async (req, res) => {
    const createdAt = Math.floor(Date.now() / 1000);
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    await db.query(
        "INSERT INTO comments (user_id, post_id, text, created_at) VALUES (?, ?, ?, ?)",
        [userId, id, text, createdAt]
    );

    const [author] = await db.query("SELECT first_name FROM users WHERE id = ?;", [userId]);

    res.json({
        success: true,
        comment: {
            firstname: author,
            user_id: userId,
            text,
            created_at: createdAt
        }
    });
};

export const getComments = async (req, res) => {
    const { id } = req.params;

    const [commentsRows] = await db.query(
        `SELECT
             c.id,
             c.text,
             c.created_at,
             u.first_name AS firstname,
             u.last_name AS lastname,
             c.user_id,
             GROUP_CONCAT(l.user_id) AS likes
         FROM comments c
                  LEFT JOIN likes l ON l.comment_id = c.id
                  JOIN users u ON c.user_id = u.id
         WHERE c.post_id = ?
         GROUP BY c.id
         ORDER BY c.created_at DESC;
        `,
        [id]
    );

    commentsRows.forEach(comment => {
        comment.likes = comment.likes
            ? comment.likes.split(',').map(id => Number(id))
            : [];
    });

    res.json([...commentsRows]);
};

export const toggleLike = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    const [like] = await db.query(
        "SELECT * FROM likes WHERE user_id = ? AND comment_id = ?;",
        [userId, commentId]
    );

    if (like.length) {
        await db.query("DELETE FROM likes WHERE id = ?", [like[0].id]);
        return res.json({ unliked: true, likeId: like[0].id });
    }

    const [result] = await db.query(
        "INSERT INTO likes (user_id, comment_id) VALUES (?, ?)",
        [userId, commentId]
    );

    const likeId = result.insertId;
    const [newLike] = await db.query("SELECT * FROM likes WHERE id = ?", [likeId]);

    return res.json({ liked: true, data: newLike[0] });
};

export const toggleFollowing = async (req, res) => {
    try {
        const { id: postId } = req.params;  // id of the post
        const userId = req.user.id;         // current logged-in user

        // Get the post's author
        const [postRows] = await db.query(
            "SELECT user_id FROM posts WHERE id = ?",
            [postId]
        );

        if (postRows.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }

        const followedId = postRows[0].user_id;

        // Check if already following this author
        const [followRows] = await db.query(
            "SELECT * FROM follow WHERE follower_id = ? AND followed_id = ?",
            [userId, followedId]
        );

        if (followRows.length > 0) {
            // Already following → unfollow
            await db.query(
                "DELETE FROM follow WHERE follower_id = ? AND followed_id = ?",
                [userId, followedId]
            );
            return res.json({ followed: false });
        }

        // Not following → follow
        const [result] = await db.query(
            "INSERT INTO follow (follower_id, followed_id) VALUES (?, ?)",
            [userId, followedId]
        );

        return res.json({ followed: true, insertId: result.insertId });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};
