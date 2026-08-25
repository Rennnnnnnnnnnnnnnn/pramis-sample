import db from "../config/db.js";
import bcrypt from "bcrypt";

// UPDATE USERNAME
export const updateUsername = async (req, res) => {
    const { username } = req.body;
    const userId = req.user.user_id;

    if (!userId) {
        return res.status(401).json({
            error: "Unauthorized."
        });
    }

    if (!username) {
        return res.status(400).json({
            error: "Username is required."
        });
    }

    if (username.length > 20) {
        return res.status(400).json({
            error: "Username must be 50 characters or less."
        });
    }

    try {
        // Check if username already exists
        const existingResult = await db.query(
            `
            SELECT user_id
            FROM users
            WHERE username = $1
            AND user_id != $2
            `,
            [username, userId]
        );

        if (existingResult.rowCount > 0) {
            return res.status(409).json({
                error: "Username already exists."
            });
        }

        // Update username
        await db.query(
            `
            UPDATE users
            SET username = $1
            WHERE user_id = $2
            `,
            [username, userId]
        );

        return res.status(200).json({
            message: "Username updated successfully."
        });

    } catch (error) {
        console.error("Update Username Error:", error);

        return res.status(500).json({
            error: "Internal server error."
        });
    }
};

// UPDATE EMAIL
export const updateEmail = async (req, res) => {
    const { email } = req.body;
    const userId = req.user.user_id;

    if (!userId) {
        return res.status(401).json({
            error: "Unauthorized."
        });
    }

    if (!email) {
        return res.status(400).json({
            error: "Email is required."
        });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: "Invalid email format."
        });
    }

    try {
        // Check if email already exists
        const existingResult = await db.query(
            `
            SELECT user_id
            FROM users
            WHERE email = $1
            AND user_id != $2
            `,
            [email, userId]
        );

        if (existingResult.rowCount > 0) {
            return res.status(409).json({
                error: "Email already exists."
            });
        }

        // Update email
        await db.query(
            `
            UPDATE users
            SET email = $1
            WHERE user_id = $2
            `,
            [email, userId]
        );

        return res.status(200).json({
            message: "Email updated successfully."
        });

    } catch (error) {
        console.error("Update Email Error:", error);

        return res.status(500).json({
            error: "Internal server error."
        });
    }
};

// UPDATE PASSWORD
export const updatePassword = async (req, res) => {
    const userId = req.user?.user_id;
    const { oldPassword, newPassword } = req.body;

    if (!userId) {
        return res.status(401).json({
            error: "Unauthorized."
        });
    }

    if (!oldPassword || !newPassword) {
        return res.status(400).json({
            error: "Old and new password are required."
        });
    }

    try {
        // Get current password hash
        const { rows } = await db.query(
            `
            SELECT password_hash
            FROM users
            WHERE user_id = $1
            `,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "User not found."
            });
        }

        const storedHash = rows[0].password_hash;

        // Verify current password
        const isValid = await bcrypt.compare(
            oldPassword,
            storedHash
        );

        if (!isValid) {
            return res.status(400).json({
                error: "Current password is incorrect."
            });
        }

        // Hash new password using the same method as registration
        const newPasswordHash = await bcrypt.hash(
            newPassword,
            10
        );

        // Update password
        await db.query(
            `
            UPDATE users
            SET password_hash = $1
            WHERE user_id = $2
            `,
            [newPasswordHash, userId]
        );

        return res.status(200).json({
            message: "Password updated successfully."
        });

    } catch (error) {
        console.error("Update Password Error:", error);

        return res.status(500).json({
            error: "Internal server error."
        });
    }
};

//GET USER INFO
export const getCurrentUser = async (req, res) => {
    const userId = req.user.user_id;

    if (!userId) {
        return res.status(401).json({
            error: "Unauthorized."
        });
    }

    try {
        const { rows } = await db.query(
            `
            SELECT user_id, username, email
            FROM users
            WHERE user_id = $1
            `,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "User not found."
            });
        }

        const user = rows[0];

        return res.status(200).json({
            user_id: user.user_id,
            username: user.username,
            email: user.email
        });

    } catch (error) {
        console.error("Get Current User Error:", error);

        return res.status(500).json({
            error: "Internal server error."
        });
    }
};

// DELETE ACCOUNT
export const deleteAccount = async (req, res) => {
    const userId = req.user?.user_id;
    const { password } = req.body;

    if (!userId) {
        return res.status(401).json({
            error: "Unauthorized."
        });
    }

    if (!password) {
        return res.status(400).json({
            error: "Password is required."
        });
    }

    try {
        // Get user's password hash
        const { rows } = await db.query(
            `
            SELECT password_hash
            FROM users
            WHERE user_id = $1
            `,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "User not found."
            });
        }

        const storedHash = rows[0].password_hash;

        // Verify password
        const isValid = await bcrypt.compare(
            password,
            storedHash
        );

        if (!isValid) {
            return res.status(401).json({
                error: "Incorrect password."
            });
        }

        // Delete account
        await db.query(
            `
            DELETE FROM users
            WHERE user_id = $1
            `,
            [userId]
        );

        return res.status(200).json({
            message: "Account deleted successfully."
        });

    } catch (error) {
        console.error("Delete Account Error:", error);

        return res.status(500).json({
            error: "Internal server error."
        });
    }
};
