import { useEffect, useState } from "react";
import api from "../services/api";

const defaultTasks = [
    {
        task_id: 1,
        task_name: "Clean my room",
        completed: false,
    },
    {
        task_id: 2,
        task_name: "Buy ice cream",
        completed: false,
    },
    {
        task_id: 3,
        task_name: "Take Meow-Meow to the vet",
        completed: false,
    },
];

function useTasks(user) {

    const [tasks, setTasks] = useState([]);
    const [tasksLoading, setTasksLoading] = useState(true);
    // =========================================================
    // GET TASKS
    useEffect(() => {
        const loadTasks = async () => {
            setTasksLoading(true);
            try {
                // LOGGED-IN USER
                if (user) {
                    const response = await api.get("/api/tasks");
                    setTasks(response.data);
                }

                // GUEST USER
                else {
                    const saved = localStorage.getItem("guestTasks");
                    if (saved) {
                        setTasks(JSON.parse(saved));
                    } else {
                        localStorage.setItem("guestTasks", JSON.stringify(defaultTasks));
                        setTasks(defaultTasks);
                    }
                }

            } catch (error) {
                console.error("Failed to load tasks:", error);
                setTasks([]);
            } finally {
                setTasksLoading(false);
            }
        };
        loadTasks();
    }, [user]);


    // =========================================================
    // GUEST STORAGE
    // =========================================================
    const saveGuestTasks = (updatedTasks) => {
        setTasks(updatedTasks);
        localStorage.setItem(
            "guestTasks",
            JSON.stringify(updatedTasks)
        );
    };

    // =========================================================
    // ADD TASK
    const addTask = async (task_name) => {
        if (!task_name.trim()) return;
        try {
            // LOGGED-IN USER
            if (user) {
                const response = await api.post("/api/tasks", {
                    task_name: task_name.trim()
                }
                );
                setTasks((prevTasks) => [
                    ...prevTasks,
                    response.data.task
                ]);

            }
            // GUEST USER
            else {
                const task = {
                    task_id: Date.now(),
                    task_name: task_name.trim(),
                    completed: false,
                };

                saveGuestTasks([
                    ...tasks,
                    task
                ]);

            }
        } catch (error) {
            console.error("Failed to create task:", error);
        }
    };

    // =========================================================
    // TOGGLE TASK
    const toggleTask = async (taskId) => {
        const task = tasks.find(
            (task) => task.task_id === taskId
        );
        if (!task) return;

        // GUEST
        if (!user) {
            const updatedTasks = tasks.map((task) =>
                task.task_id === taskId
                    ? {
                        ...task,
                        completed: !task.completed,
                    }
                    : task
            );
            saveGuestTasks(updatedTasks);
            return;
        }

        // LOGGED-IN USER
        try {
            const response = await api.put(`/api/tasks/toggle/${taskId}`, {
                completed: !task.completed
            });

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.task_id === taskId
                        ? response.data.task
                        : task
                ));
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    // EDIT TASK
    const editTask = async (taskId, task_name) => {
        if (!task_name.trim()) return;
        // Guest
        if (!user) {
            const updatedTasks = tasks.map((task) =>
                task.task_id === taskId
                    ? {
                        ...task,
                        task_name: task_name.trim(),
                    }
                    : task
            );
            saveGuestTasks(updatedTasks);
            return true;
        }

        // Logged-in User
        try {
            const response = await api.put(`/api/tasks/${taskId}`, {
                task_name: task_name.trim()
            });
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.task_id === taskId
                        ? response.data.task
                        : task
                ));
            return true;
        } catch (error) {
            console.error("Failed to edit task:", error);
        }
    };

    // DELETE TASK
    const deleteTask = async (taskId) => {
        // GUEST
        if (!user) {
            const updatedTasks = tasks.filter(
                (task) => task.task_id !== taskId
            );
            saveGuestTasks(updatedTasks);
            return;
        }
        // LOGGED-IN USER
        try {
            await api.delete(`/api/tasks/${taskId}`);
            setTasks((prevTasks) =>
                prevTasks.filter(
                    (task) => task.task_id !== taskId
                )
            );

        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };


    // CLEAR COMPLETED TASKS
    const deleteCompletedTasks = async () => {
        // GUEST
        if (!user) {
            const updatedTasks = tasks.filter(
                (task) => !task.completed
            );

            saveGuestTasks(updatedTasks);
            return;
        }

        // LOGGED-IN USER
        try {
            await api.delete("/api/tasks/deleteCompleted");

            setTasks((prevTasks) =>
                prevTasks.filter(
                    (task) => !task.completed
                )
            );

        } catch (error) {
            console.error("Failed to delete completed tasks:", error);
        }
    };

    return {
        tasks,
        tasksLoading,
        addTask,
        toggleTask,
        editTask,
        deleteTask,
        deleteCompletedTasks,
    };
}


export default useTasks;