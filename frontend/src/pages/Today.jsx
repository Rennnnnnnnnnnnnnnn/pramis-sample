import { useState } from "react";
import useHabits from "../hooks/useHabits";
import useTasks from "../hooks/useTasks";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


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
    const [editingValue, setEditingValue] = useState("");

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

    const handleSaveTask = async (task) => {
        const trimmedValue = editingValue.trim();

        if (!trimmedValue) {
            return;
        }

        const success = await editTask(
            task.task_id,
            trimmedValue
        );

        if (success) {
            setEditingTask(null);
            setEditingValue("");
        }
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
        setEditingValue("");
    };

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
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-1 transition hover:bg-app-card"
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
                            ? "text-app-text-muted line-through"
                            : "text-app-text"
                            }`}
                    >
                        {habit.name}
                    </div>

                    <div className="text-xs text-app-text-muted">
                        {habit.frequency}
                    </div>
                </div>
            </label>
        );
    };

    // =========================================================
    // TASK ROW
    const renderTask = (task) => {
        const isEditing = editingTask === task.task_id;

        return (
            <div
                key={task.task_id}
                className="flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-app-card"
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
                                ? "border-[#7fa36a] bg-app-primary"
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
                {isEditing ? (
                    <input
                        type="text"
                        value={editingValue}
                        onChange={(e) =>
                            setEditingValue(e.target.value)
                        }
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSaveTask(task);
                            }

                            if (e.key === "Escape") {
                                handleCancelEdit();
                            }
                        }}
                        className="min-w-0 flex-1 rounded border border-app-border-light bg-[#2b4234] px-2 py-1 text-sm text-app-text outline-none focus:border-app-focus"
                    />
                ) : (
                    <div
                        className={`min-w-0 flex-1 text-sm ${task.completed
                                ? "text-app-text-muted line-through"
                                : "text-app-text"
                            }`}
                    >
                        {task.task_name}
                    </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="flex shrink-0 gap-2">

                    {isEditing ? (
                        <>
                            {/* SAVE */}
                            <button
                                onClick={() =>
                                    handleSaveTask(task)
                                }
                                className="cursor-pointer rounded-md bg-app-primary px-3 py-1 text-xs font-medium text-app-text transition hover:bg-app-primary-hover"
                            >
                                Save
                            </button>

                            {/* CANCEL */}
                            <button
                                onClick={handleCancelEdit}
                                className="cursor-pointer rounded-md border border-app-border-light px-3 py-1 text-xs font-medium text-app-text-muted transition hover:bg-app-card hover:text-app-text"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            {/* EDIT */}
                            <button
                                onClick={() => {
                                    setEditingTask(task.task_id);
                                    setEditingValue(task.task_name);
                                }}
                                className="cursor-pointer rounded p-1 text-gray-400 transition hover:text-gray-300"
                                title="Edit task"
                            >
                                <EditIcon sx={{ fontSize: 22 }} />
                            </button>

                            {/* DELETE */}
                            <button
                                onClick={() =>
                                    setTaskToDelete(task)
                                }
                                className="cursor-pointer rounded p-1 text-gray-400 transition hover:text-gray-300"
                                title="Delete task"
                            >
                                <DeleteIcon sx={{ fontSize: 22 }} />
                            </button>
                        </>
                    )}

                </div>
            </div>
        );
    };

    return (
        <div className="min-h-full bg-app-bg p-3 text-app-text sm:p-5 lg:p-8">
            <div className="rounded-xl border border-app-border bg-app-surface p-6 shadow-lg">
                {/* HEADER */}
                <div className="mb-4 rounded-xl border border-app-border bg-app-card p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="mb-1 text-xl font-bold text-app-text">
                                Today's Progress
                            </h1>

                            <p className="text-sm text-app-text-muted">
                                {currentMonth} {currentDay},{" "}
                                {currentYear} -{" "}
                                {getWeekday(currentDay)}
                            </p>
                        </div>

                        <div className="text-sm text-app-text-muted">
                            {completedToday}/{todayHabits.length}
                        </div>
                    </div>
                </div>

                {/* TABS */}
                <div className="mb-4 flex rounded-lg bg-app-card">
                    <button
                        onClick={() =>
                            setActiveTab("today")
                        }
                        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition cursor-pointer ${activeTab === "today"
                            ? "bg-app-primary text-app-text"
                            : "text-app-text-muted hover:bg-app-card"
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
                            ? "bg-app-primary text-app-text"
                            : "text-app-text-muted hover:bg-app-card"
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
                        <p className="text-sm text-app-text-muted">
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
                                        <p className="text-sm text-app-text-muted">
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
                                        <p className="text-sm text-app-text-muted">
                                            No completed promises yet.
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* TASKS */}
                <div className="mt-6 border-t border-app-border pt-4">
                    {/* TASK HEADER */}
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-app-text">
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
                            className="flex-1 rounded-lg border border-app-border-light bg-app-card px-3 py-2 text-sm text-app-text outline-none placeholder:text-app-text-muted focus-border-app-focus"
                        />

                        <button
                            onClick={() => {
                                addTask(newTask);
                                setNewTask("");
                            }}
                            className="cursor-pointer rounded-md bg-app-primary px-4 py-1 text-xs text-app-text hover:bg-app-primary-hover"
                        >
                            + Add
                        </button>
                    </div>

                    {/* TASK LIST */}
                    <div className="space-y-1">
                        {tasksLoading ? (
                            <p className="py-4 text-center text-sm text-app-text-muted">
                                Loading...
                            </p>
                        ) : tasks.length === 0 ? (
                            <p className="py-4 text-center text-sm text-app-text-muted">
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
                    <div className="w-80 rounded-xl border border-app-border bg-maomao-forest p-6 shadow-2xl">
                        <h3 className="mb-3 text-lg font-bold text-app-text">
                            Delete Task
                        </h3>

                        <p className="mb-6 text-sm text-app-text-muted">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-app-text">
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
                                className="rounded-lg border border-gray-400 px-4 py-2 text-sm text-app-text-muted hover:text-app-text"
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