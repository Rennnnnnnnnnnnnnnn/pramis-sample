import { useState } from "react";
import useHabits from "../hooks/useHabits";
import useTasks from "../hooks/useTasks";

function Today({ user }) {
    // HOOKS
    // =========================================================
    const {
        completed,
        habitsLoading,
        logsLoading,
        toggleDay,
        getTodayHabits,
    } = useHabits(user);

    const {
        tasks,
        tasksLoading,
        addTask,
        toggleTask,
        editTask,
        deleteTask,
        deleteCompletedTasks,
    } = useTasks(user);

    // STATE
    // =========================================================
    const [activeTab, setActiveTab] = useState("today");
    const [newTask, setNewTask] = useState("");
    const [editingTask, setEditingTask] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);

    // DATE
    // =========================================================
    const today = new Date();
    const currentMonth = today.toLocaleString("default", { month: "long", });
    const currentDay = today.getDate();
    const currentYear = today.getFullYear();

    const getWeekday = (day) => {
        return new Date(
            today.getFullYear(),
            today.getMonth(),
            day
        ).toLocaleDateString("default", {
            weekday: "long",
        });
    };

    // HABITS
    // =========================================================
    const todayHabits = getTodayHabits();
    const incompleteHabits = todayHabits.filter((habit) =>
        !completed[`${habit.habit_id}-${currentDay}`]
    );

    const completedHabits = todayHabits.filter((habit) =>
        completed[`${habit.habit_id}-${currentDay}`]
    );

    const completedToday = completedHabits.length;

    // TASKS
    // =========================================================
    const sortedTasks = [...tasks].sort((a, b) => {
        // Both incomplete
        if (!a.completed && !b.completed) {
            return 0;
        }
        // Incomplete before completed
        if (!a.completed && b.completed) {
            return -1;
        }

        if (a.completed && !b.completed) {
            return 1;
        }
        // Both completed
        return (
            new Date(a.completed_at || 0) -
            new Date(b.completed_at || 0)
        );
    });

    const hasCompletedTasks = tasks.some(
        (task) => task.completed
    );

    // HABIT ROW
    // =========================================================
    const renderHabit = (habit) => {

        const key = `${habit.habit_id}-${currentDay}`;
        const checked = completed[key];

        return (
            <label
                key={habit.habit_id}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-1 transition hover:bg-[#263b2b]"
            >

                {/* CHECKBOX */}

                <input
                    type="checkbox"
                    checked={checked || false}
                    onChange={() =>
                        toggleDay(
                            habit,
                            currentDay
                        )
                    }
                    className="hidden"
                />

                {/* CHECK CIRCLE */}

                <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all"
                    style={{
                        backgroundColor: checked
                            ? habit.color
                            : "transparent",
                        borderColor: habit.color,
                    }}
                >
                    {checked && (
                        <span className="text-xs font-bold text-white">
                            ✓
                        </span>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div
                        className={`text-sm font-medium ${checked
                            ? "text-[#829b7d] line-through"
                            : "text-[#e8dcc2]"
                            }`}
                    >
                        {habit.name}
                    </div>

                    <div className="text-xs text-[#829b7d]">
                        {habit.frequency}
                    </div>
                </div>
            </label>
        );
    };

    // =========================================================
    // TASK ROW
    const renderTask = (task) => {
        return (
            <div
                key={task.task_id}
                className="flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-[#263b2b]"
            >

                {/* CHECKBOX */}
                <label className="flex cursor-pointer items-center">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() =>
                            toggleTask(task.task_id)
                        }
                        className="hidden"
                    />
                    <div
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${task.completed
                            ? "border-[#7fa36a] bg-[#7fa36a]"
                            : "border-[#829b7d]"
                            }`}
                    >
                        {task.completed && (
                            <span className="flex h-full w-full items-center justify-center pb-[2px] text-xs font-thin leading-none text-white">
                                x
                            </span>
                        )}
                    </div>
                </label>

                {/* TASK NAME */}
                {editingTask === task.task_id ? (
                    <input
                        type="text"
                        defaultValue={task.task_name}
                        autoFocus
                        onKeyDown={async (e) => {

                            if (e.key === "Enter") {

                                const success = await editTask(
                                    task.task_id,
                                    e.target.value
                                );

                                if (success) {
                                    setEditingTask(null);
                                }
                            }

                            if (e.key === "Escape") {
                                setEditingTask(null);
                            }
                        }}
                        className="min-w-0 flex-1 rounded border border-[#49634d] bg-[#2b4234] px-2 text-sm text-[#f5e8c8] outline-none"
                    />

                ) : (
                    <div
                        className={`min-w-0 flex-1 text-sm ${task.completed
                            ? "text-[#829b7d] line-through"
                            : "text-[#e8dcc2]"
                            }`}
                    >
                        {task.task_name}
                    </div>
                )}

                {/* EDIT / DELETE */}
                <div className="flex shrink-0 gap-1">
                    <button
                        onClick={() =>
                            setEditingTask(task.task_id)
                        }
                        className="cursor-pointer rounded px-1 text-blue-400 hover:text-blue-300"
                    >
                        ✏️
                    </button>

                    <button
                        onClick={() =>
                            setTaskToDelete(task)
                        }
                        className="cursor-pointer rounded px-1 text-red-400 hover:text-red-300"
                    >
                        🗑
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-full bg-maomao-night p-3 text-[#f2ead8] sm:p-5 lg:p-8">
            <div className="rounded-xl border border-maomao-dark-border bg-maomao-forest p-6 shadow-lg">
                {/* HEADER */}
                <div className="mb-4 rounded-xl border border-[#344d3b] bg-[#1d3024] p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="mb-1 text-xl font-bold text-[#f5e8c8]">
                                Today's Progress
                            </h1>

                            <p className="text-sm text-[#829b7d]">
                                {currentMonth} {currentDay},{" "}
                                {currentYear} -{" "}
                                {getWeekday(currentDay)}
                            </p>
                        </div>

                        <div className="text-sm text-[#b6c8a5]">
                            {completedToday}/{todayHabits.length}
                        </div>
                    </div>
                </div>

                {/* TABS */}
                <div className="mb-4 flex rounded-lg bg-[#1d3024]">
                    <button
                        onClick={() =>
                            setActiveTab("today")
                        }
                        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition cursor-pointer ${activeTab === "today"
                            ? "bg-[#7fa36a] text-[#f5e8c8]"
                            : "text-[#b6c8a5] hover:bg-[#263b2b]"
                            }`}
                    >
                        Today
                        <span className="ml-2 text-xs">
                            {incompleteHabits.length}
                        </span>
                    </button>

                    <button
                        onClick={() =>
                            setActiveTab("completed")
                        }
                        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition cursor-pointer ${activeTab === "completed"
                            ? "bg-[#7fa36a] text-[#f5e8c8]"
                            : "text-[#b6c8a5] hover:bg-[#263b2b]"
                            }`}
                    >
                        Completed
                        <span className="ml-2 text-xs">
                            {completedHabits.length}
                        </span>
                    </button>
                </div>

                {/* PROMISES */}
                {habitsLoading || logsLoading ? (
                    <div className="py-10 text-center">
                        <p className="text-sm text-[#829b7d]">
                            Loading . . .
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {/* TODAY */}
                        {activeTab === "today" && (
                            <>
                                {incompleteHabits.map(
                                    renderHabit
                                )}

                                {incompleteHabits.length === 0 && (
                                    <div className="py-10 text-center">
                                        <p className="text-sm text-[#829b7d]">
                                            {todayHabits.length === 0 ? "No activities scheduled for today." : "All promises completed!"}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* COMPLETED */}
                        {activeTab === "completed" && (
                            <>
                                {completedHabits.map(
                                    renderHabit
                                )}

                                {completedHabits.length === 0 && (
                                    <div className="py-10 text-center">
                                        <p className="text-sm text-[#829b7d]">
                                            No completed promises yet.
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* TASKS */}
                <div className="mt-6 border-t border-[#344d3b] pt-4">
                    {/* TASK HEADER */}
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[#f5e8c8]">
                            Tasks
                        </h3>

                        <button
                            onClick={deleteCompletedTasks}
                            disabled={!hasCompletedTasks}
                            className={`rounded-md px-2 py-1 text-xs text-white ${hasCompletedTasks
                                ? "cursor-pointer bg-red-600 hover:bg-red-700"
                                : "bg-gray-600 opacity-50"
                                }`}
                        >
                            Clear Completed
                        </button>
                    </div>

                    {/* ADD TASK */}
                    <div className="mb-3 flex gap-2">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) =>
                                setNewTask(e.target.value)
                            }
                            onKeyDown={(e) => {

                                if (e.key === "Enter") {
                                    addTask(newTask);
                                    setNewTask("");
                                }

                            }}
                            placeholder="Add a task..."
                            className="flex-1 rounded-lg border border-[#49634d] bg-[#2b4234] px-3 py-2 text-sm text-[#f5e8c8] outline-none placeholder:text-[#829b7d] focus:border-[#7fa36a]"
                        />

                        <button
                            onClick={() => {
                                addTask(newTask);
                                setNewTask("");
                            }}
                            className="cursor-pointer rounded-md bg-[#7fa36a] px-4 py-1 text-xs text-[#f5e8c8] hover:bg-[#91b878]"
                        >
                            + Add
                        </button>
                    </div>

                    {/* TASK LIST */}
                    <div className="space-y-1">
                        {tasksLoading ? (
                            <p className="py-4 text-center text-sm text-[#829b7d]">
                                Loading...
                            </p>
                        ) : tasks.length === 0 ? (
                            <p className="py-4 text-center text-sm text-[#829b7d]">
                                No tasks
                            </p>
                        ) : (
                            sortedTasks.map(renderTask)
                        )}
                    </div>
                </div>
            </div>

            {/*  DELETE TASK MODAL */}
            {taskToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
                    <div className="w-80 rounded-xl border border-[#344d3b] bg-maomao-forest p-6 shadow-2xl">
                        <h3 className="mb-3 text-lg font-bold text-[#f5e8c8]">
                            Delete Task
                        </h3>

                        <p className="mb-6 text-sm text-[#b6c8a5]">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-[#f5e8c8]">
                                "{taskToDelete.task_name}"
                            </span>
                            ?
                            <br />
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() =>
                                    setTaskToDelete(null)
                                }
                                className="rounded-lg border border-gray-400 px-4 py-2 text-sm text-[#b6c8a5] hover:text-[#f5e8c8]"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    await deleteTask(taskToDelete.task_id);
                                    setTaskToDelete(null);
                                }}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Today;