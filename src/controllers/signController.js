import db from "../../database/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    const { email, password } = req.body;
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?;", [email]);
    const user = rows[0];

    if (!user) {
        return res.status(401).json({error: "Invalid credentials"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "secretkey",
        { expiresIn: "1h" }
    );

    res.json({ token, user });
};

export const register = async (req, res) => {
    try {
        const { firstname, lastname, phone, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO users (first_name, last_name, phone, email, password) VALUES (?, ?, ?, ?, ?)",
            [firstname, lastname, phone, email, hashedPassword]
        );

        const [rows] = await db.query("SELECT * FROM users WHERE email = ?;", [email]);
        const user = rows[0];

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({ token, user });
    } catch (err) {
        console.error(err);

        res.status(500).json({ error: "Server error" });
    }
};
