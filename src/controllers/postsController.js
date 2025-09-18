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
        `SELECT comments.id, comments.text, comments.created_at, users.first_name AS firstname, users.last_name AS lastname, comments.user_id
     FROM comments
     JOIN users ON comments.user_id = users.id
     WHERE comments.post_id = ?
     ORDER BY comments.created_at DESC`,
        [id]
    );

    res.json({
        ...postRow,
        tags: tagsRows,
        comments: commentsRows
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

    const [rows] = await db.query(
        `SELECT comments.id, comments.text, comments.created_at, users.first_name AS firstname, comments.user_id
         FROM comments
         JOIN users ON comments.user_id = users.id
         WHERE comments.post_id = ?
         ORDER BY comments.created_at DESC`,
        [id]
    );

    res.json(rows);
};
