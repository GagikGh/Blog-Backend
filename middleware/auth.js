import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ error: "No authorization header" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("JWT Verify Error:", err);
            return res.status(403).json({ error: "Invalid token" });
        }

        req.user = decoded;
        next();
    });
};
