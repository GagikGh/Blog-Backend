import db from "../../database/db.js";
import dotenv from 'dotenv';
dotenv.config();

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
        `SELECT
             posts.*,
             users.first_name AS firstname,
             users.last_name AS lastname,
             GROUP_CONCAT(CONCAT(tags.id, ':', tags.name, ':', tags.color) SEPARATOR '|') AS tags
         FROM posts
                  JOIN users ON posts.user_id = users.id
                  LEFT JOIN post_tags ON posts.id = post_tags.post_id
                  LEFT JOIN tags ON post_tags.tag_id = tags.id
         WHERE posts.id = ?
         GROUP BY posts.id;`,
        [id]
    );

    if (!rows.length) return res.status(404).json({ error: "Post not found" });

    const row = rows[0];

    const tags = row.tags ? row.tags.split('|').map(tagStr => {
            const [id, name, color] = tagStr.split(':');
            return { id: Number(id), name, color };
        }) : [];

    const post = {
        id: row.id,
        user_id: row.user_id,
        title: row.title,
        description: row.description,
        created_at: row.created_at,
        firstname: row.firstname,
        lastname: row.lastname,
        tags
    };

    console.log(post);

    res.json(post);
};


export const addPost = async (req, res) => {
    const createdAt = Math.floor(Date.now() / 1000);
    const { title, description } = req.body;

    await db.query("INSERT INTO posts (user_id, title, description, created_at) " +
        "VALUES (?, ?, ?, ?);", [ parseInt(process.env.outUserId), title, description, createdAt]);

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

    console.log(postsByTag);
    res.json(postsByTag);
};
