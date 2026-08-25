import bcrypt from "bcrypt";
import db from "../config/db.js";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required.",
            });
        }

        // Check if username already exists
        const existingUsername = await db.query(
            "SELECT user_id FROM users WHERE username = $1", [username]
        );

        if (existingUsername.rows.length > 0) {
            return res.status(409).json({ message: "Username already exists.", });
        }

        // Check email if provided
        if (email) {
            const existingEmail = await db.query(
                "SELECT user_id FROM users WHERE email = $1", [email]);

            if (existingEmail.rows.length > 0) {
                return res.status(409).json({ message: "Email already exists.", });
            }
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const result = await db.query(
            `
            INSERT INTO users(username, email, password_hash)
            VALUES($1, $2, $3)
            RETURNING user_id, username, email, created_at
            `,
            [username, email, passwordHash]
        );

        res.status(201).json({
            message: "Account created successfully.",
            user: result.rows[0],
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error.",
        });
    }
};

//  LOGIN
export const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                message: "Username/email and password are required.",
            });
        }

        const result = await db.query(
            `SELECT *
            FROM users
            WHERE username = $1 OR email = $1`,
            [identifier]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const user = result.rows[0];

        const validPassword = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid credentials.",
            });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error.", });
    }
};

