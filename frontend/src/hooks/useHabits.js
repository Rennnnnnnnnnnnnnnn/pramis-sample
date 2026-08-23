import { useState, useEffect } from "react";
import api from "../services/api.js";

export default function useHabits(user) {

    // ================================
    // DEFAULT HABITS
    const defaultHabits = [
        {
            habit_id: 1,
            name: "Make my bed",
            frequency: "daily",
            color: "#3b82f6",
        },
        {
            habit_id: 2,
            name: "Read a book",
            frequency: "weekdays",
            color: "#e61010",
        },
        {
            habit_id: 3,
            name: "Go for a walk",
            frequency: "weekends",
            color: "#22c55e",
        },
    ];

    // ================================
    // LOAD GUEST DATA
    const getGuestHabits = () => {
        const saved = localStorage.getItem("guestHabits");

        if (saved) {
            return JSON.parse(saved);
        }

        // First time guest
        localStorage.setItem(
            "guestHabits",
            JSON.stringify(defaultHabits)
        );

        return defaultHabits;
    };

    const getGuestLogs = () => {
        const saved = localStorage.getItem("guestHabitLogs");

        return saved ? JSON.parse(saved) : {};
    };

    // ================================
    // STATE
    const [habits, setHabits] = useState(() => {
        if (user) return [];
        return getGuestHabits();
    });

    const [completed, setCompleted] = useState(() => {
        if (user) return {};
        return getGuestLogs();
    });


    const [habitsLoading, setHabitsLoading] = useState(!!user);
    const [logsLoading, setLogsLoading] = useState(false);
    // ================================
    // SYNC GUEST DATA
    useEffect(() => {
        if (user) return;
        const syncGuestData = () => {
            const savedHabits =
                localStorage.getItem("guestHabits");

            const savedLogs =
                localStorage.getItem("guestHabitLogs");

            if (savedHabits) {
                setHabits(JSON.parse(savedHabits));
            }

            if (savedLogs) {
                setCompleted(JSON.parse(savedLogs));
            }
        };

        window.addEventListener(
            "guestHabitsUpdated",
            syncGuestData
        );

        return () => {
            window.removeEventListener(
                "guestHabitsUpdated",
                syncGuestData
            );
        };
    }, [user]);


    // ================================
    // GET HABITS
    const getHabits = async () => {
        try {
            setHabitsLoading(true);

            const response =
                await api.get("/api/habits");

            setHabits(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setHabitsLoading(false);
        }
    };


    // ================================
    // GET HABIT LOGS
    const getHabitLogs = async () => {
        try {
            setLogsLoading(true);
            const response = await api.get("/api/habit-logs");
            const completedMap = {};

            response.data.forEach((log) => {
                const date = new Date(log.completed_date);
                const day = date.getDate();

                completedMap[`${log.habit_id}-${day}`] = true;

            });

            setCompleted(completedMap);

        } catch (error) {
            console.error(error);
        } finally {
            setLogsLoading(false);
        }

    };


    // ================================
    // LOAD USER DATA
    useEffect(() => {

        if (!user) return;

        const loadData = async () => {

            await getHabits();
            await getHabitLogs();

        };

        loadData();

    }, [user]);


    // ================================
    // TOGGLE DAY
    const toggleDay = async (habit, day) => {

        const today = new Date();

        const key =
            `${habit.habit_id}-${day}`;

        const checked =
            completed[key];


        // ============================
        // GUEST
        if (!user) {

            setCompleted((prev) => {

                const updated = {
                    ...prev,
                    [key]: !checked,
                };


                localStorage.setItem(
                    "guestHabitLogs",
                    JSON.stringify(updated)
                );


                // Tell other useHabits instances
                window.dispatchEvent(
                    new Event("guestHabitsUpdated")
                );


                return updated;

            });

            return;

        }
        // ============================
        // USER
        try {

            const date =
                `${today.getFullYear()}-${String(
                    today.getMonth() + 1
                ).padStart(2, "0")}-${String(day).padStart(
                    2,
                    "0"
                )}`;


            if (!checked) {

                await api.post(
                    "/api/habit-logs",
                    {
                        habitId: habit.habit_id,
                        date,
                    }
                );

            } else {

                await api.delete(
                    "/api/habit-logs",
                    {
                        data: {
                            habitId: habit.habit_id,
                            date,
                        },
                    }
                );

            }


            setCompleted((prev) => ({
                ...prev,
                [key]: !checked,
            }));

        } catch (error) {

            console.error(error);

        }

    };


    // ================================
    // ADD HABIT
    const addHabit = async (habitData) => {
        try {
            // ============================
            // GUEST
            if (!user) {

                setHabits((prev) => {

                    const newHabit = {
                        habit_id: Date.now(),
                        ...habitData,
                    };


                    const updated = [
                        ...prev,
                        newHabit,
                    ];

                    // SAVE
                    localStorage.setItem(
                        "guestHabits",
                        JSON.stringify(updated)
                    );

                    // SYNC
                    window.dispatchEvent(
                        new Event("guestHabitsUpdated")
                    );

                    return updated;

                });

                return;

            }


            // ============================
            // USER

            const response =
                await api.post(
                    "/api/habits",
                    habitData
                );


            setHabits((prev) => [
                ...prev,
                response.data.habit,
            ]);

        } catch (error) {

            console.error(error);

        }

    };


    // ================================
    // EDIT HABIT

    const editHabitSave = async (
        id,
        habitData
    ) => {

        try {

            // ============================
            // GUEST

            if (!user) {

                setHabits((prev) => {

                    const updated =
                        prev.map((habit) =>
                            habit.habit_id === id
                                ? {
                                    ...habit,
                                    ...habitData,
                                }
                                : habit
                        );


                    localStorage.setItem(
                        "guestHabits",
                        JSON.stringify(updated)
                    );


                    window.dispatchEvent(
                        new Event("guestHabitsUpdated")
                    );


                    return updated;

                });

                return;

            }


            // ============================
            // USER

            const response =
                await api.put(
                    `/api/habits/${id}`,
                    habitData
                );


            setHabits((prev) =>
                prev.map((habit) =>
                    habit.habit_id === id
                        ? response.data.habit
                        : habit
                )
            );

        } catch (error) {

            console.error(error);

        }

    };


    // ================================
    // DELETE HABIT

    const deleteHabit = async (id) => {

        try {

            // ============================
            // GUEST

            if (!user) {

                setHabits((prev) => {

                    const updated =
                        prev.filter(
                            (habit) =>
                                habit.habit_id !== id
                        );


                    localStorage.setItem(
                        "guestHabits",
                        JSON.stringify(updated)
                    );


                    // Remove completion logs
                    // for this habit

                    setCompleted((previous) => {

                        const updatedLogs = {
                            ...previous,
                        };


                        Object.keys(updatedLogs)
                            .forEach((key) => {

                                if (
                                    key.startsWith(
                                        `${id}-`
                                    )
                                ) {
                                    delete updatedLogs[key];
                                }

                            });


                        localStorage.setItem(
                            "guestHabitLogs",
                            JSON.stringify(updatedLogs)
                        );


                        return updatedLogs;

                    });


                    // Tell Today page

                    window.dispatchEvent(
                        new Event("guestHabitsUpdated")
                    );


                    return updated;

                });

                return;

            }


            // ============================
            // USER

            await api.delete(
                `/api/habits/${id}`
            );


            setHabits((prev) =>
                prev.filter(
                    (habit) =>
                        habit.habit_id !== id
                )
            );


            setCompleted((prev) => {

                const updated = {
                    ...prev,
                };


                Object.keys(updated)
                    .forEach((key) => {

                        if (
                            key.startsWith(`${id}-`)
                        ) {
                            delete updated[key];
                        }

                    });


                return updated;

            });

        } catch (error) {

            console.error(error);

        }

    };


    // ================================
    // TODAY'S HABITS

    const getTodayHabits = () => {

        const today = new Date();

        const todayWeekday =
            today.getDay();


        return habits.filter((habit) => {

            switch (habit.frequency) {

                case "daily":
                    return true;

                case "weekdays":
                    return (
                        todayWeekday >= 1 &&
                        todayWeekday <= 5
                    );

                case "weekends":
                    return (
                        todayWeekday === 0 ||
                        todayWeekday === 6
                    );

                case "custom":
                    return true;

                default:
                    return true;

            }

        });

    };



    // ================================
    // REORDER HABITS

    const reorderHabits = async (newHabits) => {

        // ============================
        // GUEST

        if (!user) {

            setHabits(newHabits);

            localStorage.setItem(
                "guestHabits",
                JSON.stringify(newHabits)
            );

            window.dispatchEvent(
                new Event("guestHabitsUpdated")
            );

            return;
        }


        // ============================
        // USER

        try {

            // Update UI immediately
            setHabits(newHabits);

            await api.put(
                "/api/habits/reorder",
                {
                    habits: newHabits.map((habit) => ({
                        id: habit.habit_id
                    }))
                }
            );

        } catch (error) {

            console.error(
                "Failed to reorder habits:",
                error
            );

            // Reload database order if request fails
            await getHabits();

        }

    };






    // ================================
    // RETURN

    return {
        habits,
        completed,
        habitsLoading,
        logsLoading,
        getTodayHabits,
        toggleDay,
        addHabit,
        editHabitSave,
        deleteHabit,
        reorderHabits,
    };

}