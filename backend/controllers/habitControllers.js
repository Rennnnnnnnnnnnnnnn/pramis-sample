import db from "../config/db.js";

// CREATE HABIT
export const createHabit = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { name, color, frequency } = req.body;

        if (!name || !frequency) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const result = await db.query(
            `
            INSERT INTO habits
            (
                user_id,
                name,
                color,
                frequency
            )

            VALUES($1,$2,$3,$4)

            RETURNING *
            `,
            [
                user_id,
                name,
                color,
                frequency
            ]
        );

        res.status(201).json({
            message: "Habit created",
            habit: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });

    }
};

// GET HABITS
export const getHabits = async (req, res) => {
    try {
        const user_id = req.user.user_id;

        const result = await db.query(
            `
            SELECT *
            FROM habits
            WHERE user_id = $1
            ORDER BY created_at ASC
            `,
            [user_id]
        );


        res.json(result.rows);


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }
}

// UPDATE HABIT
export const updateHabit = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            name,
            color,
            frequency
        } = req.body;


        const result = await db.query(
            `
            UPDATE habits
            SET
                name = $1,
                color = $2,
                frequency = $3
            WHERE id = $4
            RETURNING *
            `,
            [
                name,
                color,
                frequency,
                id
            ]
        );


        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Habit not found"
            });
        }


        res.json({
            message: "Habit updated",
            habit: result.rows[0]
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};

// DELETE HABIT
export const deleteHabit = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            `
            DELETE FROM habits
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Habit not found" });
        }
        res.json({ message: "Habit deleted", habit: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

