import db from "../config/db.js";

// CREATE TASK
export const createTask = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { task_name } = req.body;

        if (!task_name) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const result = await db.query(
            `
            INSERT INTO tasks
            (
                user_id,
                task_name
            )

            VALUES($1,$2)

            RETURNING *
            `,
            [
                user_id,
                task_name
            ]
        );

        res.status(201).json({
            message: "Task created",
            task: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// GET TASKS
export const getTasks = async (req, res) => {
    try {
        const user_id = req.user.user_id;

        const result = await db.query(
            `
            SELECT *
            FROM tasks
            WHERE user_id = $1
            ORDER BY task_id ASC;
            `,
            [user_id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE TASK
export const deleteTask = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { task_id } = req.params;
        console.log(req.params, "asdasd")

        const result = await db.query(
            `
            DELETE FROM tasks
            WHERE task_id = $1
              AND user_id = $2
            RETURNING *
            `,
            [
                task_id,
                user_id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({
            message: "Task deleted",
            task: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE ALL COMPLETED TASKS
export const deleteCompletedTasks = async (req, res) => {
    try {
        const user_id = req.user.user_id;

        await db.query(
            `
            DELETE FROM tasks
            WHERE user_id = $1
              AND completed = TRUE
            `,
            [user_id]
        );

        res.status(200).json({
            message: "Completed tasks deleted"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// EDIT TASK
export const editTask = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { task_id } = req.params;
        const { task_name } = req.body;

        if (!task_name) {
            return res.status(400).json({
                message: "Task name is required"
            });
        }

        const result = await db.query(
            `
            UPDATE tasks 
            SET task_name = $1
            WHERE task_id = $2
              AND user_id = $3
            RETURNING *
            `,
            [
                task_name,
                task_id,
                user_id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated",
            task: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// TOGGLE TASK
export const toggleTask = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { task_id } = req.params;

        const result = await db.query(
            `
            UPDATE tasks
            SET
                completed = NOT completed,
                completed_at = CASE
                    WHEN completed = FALSE THEN NOW()
                    ELSE NULL
                END
            WHERE task_id = $1
              AND user_id = $2
            RETURNING *
            `,
            [task_id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated",
            task: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};