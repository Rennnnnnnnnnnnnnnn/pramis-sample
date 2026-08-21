import db from "../config/db.js";

// CHECK HABIT
export const checkHabit = async (req, res) => {
    try {
        const { habitId, date } = req.body;

        if (!habitId || !date) {
            return res.status(400).json({
                message: "Habit ID and date are required.",
            });
        }

        const result = await db.query(
            `
            INSERT INTO habit_logs (habit_id, completed_date)
            VALUES ($1, $2)
            ON CONFLICT (habit_id, completed_date)
            DO NOTHING
            RETURNING *;
            `,
            [habitId, date]
        );

        return res.status(201).json({
            message: "Habit checked.",
            log: result.rows[0] ?? null,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error.",
        });
    }
};

// UNCHECK HABIT
export const uncheckHabit = async (req, res) => {
    try {
        const { habitId, date } = req.body;

        if (!habitId || !date) {
            return res.status(400).json({
                message: "Habit ID and date are required.",
            });
        }

        await db.query(
            `
            DELETE FROM habit_logs
            WHERE habit_id = $1
              AND completed_date = $2
            `,
            [habitId, date]
        );

        return res.status(200).json({
            message: "Habit unchecked.",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error.",
        });
    }
};

// GET HABIT LOGS
export const getHabitLogs = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        console.log('asdasd ', user_id)
        const result = await db.query(
            `
            SELECT
                hl.habit_id,
                hl.completed_date
            FROM habit_logs hl
            JOIN habits h
                ON h.id = hl.habit_id
            WHERE h.user_id = $1
            `,
            [user_id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error."
        });
    }
};
