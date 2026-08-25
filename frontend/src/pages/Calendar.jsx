import { useState, useEffect, useRef } from "react";
import useHabits from "../hooks/useHabits";
import { DndContext, closestCenter, } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove, } from "@dnd-kit/sortable";
import SortableHabit from "../components/SortableHabit";

function Calendar({ user }) {

    const [showModal, setShowModal] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);
    const [habitToDelete, setHabitToDelete] = useState(null);
    const [newHabit, setNewHabit] = useState("");
    const [frequency, setFrequency] = useState("daily");
    const [color, setColor] = useState("#22c55e");

    const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;

    const resetHabitForm = () => {
        setEditingHabit(null);
        setNewHabit("");
        setFrequency("daily");
        setColor("#22c55e");
        setShowModal(false);
    };

    const handleDragEnd = async ({ active, over }) => {
        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = habits.findIndex(
            (habit) => habit.habit_id === active.id
        );

        const newIndex = habits.findIndex(
            (habit) => habit.habit_id === over.id
        );

        const newHabits = arrayMove(
            habits,
            oldIndex,
            newIndex
        );

        await reorderHabits(newHabits);
    };

    const closeModal = () => {
        resetHabitForm();
    };

    const handleAddHabit = async () => {
        if (!newHabit.trim()) return;
        await addHabit({
            name: newHabit,
            frequency,
            color,
        });
        resetHabitForm();
    };

    const handleEditHabit = (habit) => {
        setEditingHabit(habit);
        setNewHabit(habit.name);
        setFrequency(habit.frequency);
        setColor(habit.color);
        setShowModal(true);
    };

    const handleEditSave = async () => {
        if (!newHabit.trim()) return;

        await editHabitSave(editingHabit.habit_id, {
            name: newHabit,
            frequency,
            color,
        });

        resetHabitForm();
    };

    const handleDeleteHabit = async () => {
        if (!habitToDelete) return;

        await deleteHabit(habitToDelete.habit_id);

        setHabitToDelete(null);
    };


    const {
        habits,
        completed,
        habitsLoading,
        toggleDay,
        addHabit,
        editHabitSave,
        deleteHabit,
        reorderHabits,
    } = useHabits(user);

    const today = new Date();

    const currentMonth = today.toLocaleString("default", {
        month: "long",
    });

    const currentDay = today.getDate();

    const daysInMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
    ).getDate();

    const days = Array.from(
        { length: daysInMonth },
        (_, i) => i + 1
    );

    const calendarRef = useRef(null);
    const todayRef = useRef(null);


    // =========================
    // HELPERS
    const getWeekday = (day) => {
        return new Date(
            today.getFullYear(),
            today.getMonth(),
            day
        ).toLocaleDateString("default", {
            weekday: "short",
        });
    };


    const shouldShowDay = (habit, day) => {
        const date = new Date(
            today.getFullYear(),
            today.getMonth(),
            day
        );

        const weekDay = date.getDay();

        switch (habit.frequency) {
            case "daily":
                return true;
            case "weekdays":
                return weekDay >= 1 && weekDay <= 5;
            case "weekends":
                return weekDay === 0 || weekDay === 6;
            case "custom":
                return true;
            default:
                return true;
        }
    };

    const getTotalDays = (habit) => {
        return days.filter(
            (day) => shouldShowDay(habit, day)
        ).length;
    };


    const getCompletedCount = (habit) => {
        return days.filter(
            (day) => completed[`${habit.habit_id}-${day}`]
        ).length;
    };

    // =========================
    // SCROLL
    useEffect(() => {
        if (user && habitsLoading) return;

        if (!todayRef.current || !calendarRef.current) return;

        if (window.innerWidth < 1024) {
            todayRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
            });
        }
    }, [user, habitsLoading, daysInMonth]);

    return (
        <div className="min-h-full bg-maomao-night p-3 sm:p-5 lg:p-8 text-[#f2ead8]">
            <div className="rounded-xl border border-maomao-dark-border bg-maomao-forest p-6 shadow-lg">
                {/* HEADER */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-[#f5e8c8]">
                        {currentMonth}
                    </h1>
                </div>
                {/* CALENDAR */}
                <div className="flex flex-col gap-8 lg:gap-25 lg:flex-row">
                    {/* PROMISES SIDEBAR */}
                    <div className="w-full space-y-3 lg:w-auto lg:shrink-0">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-[#f5e8c8]">
                                Promises
                            </h3>

                            <button
                                onClick={() => {
                                    setEditingHabit(null);
                                    setNewHabit("");
                                    setFrequency("daily");
                                    setColor(getRandomColor());
                                    setShowModal(true);
                                }}
                                className="rounded-md bg-[#7fa36a] px-2 py-1.5 text-xs text-[#f5e8c8] hover:bg-[#91b878]"
                            >
                                + New
                            </button>
                        </div>

                        <DndContext
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={habits.map((habit) => habit.habit_id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3">
                                    {habits.map((habit) => (
                                        <SortableHabit
                                            key={habit.habit_id}
                                            habit={habit}
                                            onEdit={handleEditHabit}
                                            onDelete={setHabitToDelete}
                                        />
                                    ))}
                                </div>

                            </SortableContext>
                        </DndContext>
                    </div>
                    {/* CALENDAR GRID */}
                    <div
                        ref={calendarRef}
                        className="flex-1 overflow-x-auto"
                    >
                        {/* DAYS */}
                        <div
                            className="mb-4 grid items-center gap-3"
                            style={{
                                gridTemplateColumns:
                                    `repeat(${daysInMonth}, 1.5rem) 4rem`,
                            }}
                        >
                            {days.map((day) => (
                                <div
                                    key={day}
                                    ref={
                                        day === currentDay
                                            ? todayRef
                                            : null
                                    }
                                    className="flex flex-col items-center justify-center"
                                >
                                    <span className="text-[10px] text-[#829b7d]">
                                        {getWeekday(day)}
                                    </span>

                                    <span
                                        className={`text-xs ${day === currentDay
                                            ? "font-extrabold text-[#9fcf8b]"
                                            : "text-[#829b7d]"
                                            }`}
                                    >
                                        {day}
                                    </span>
                                </div>
                            ))}

                            <div className="text-right text-xs text-[#829b7d]">
                                Done
                            </div>
                        </div>
                        {/* HABIT ROWS */}
                        <div className="space-y-6 pb-5">
                            {habits.map((habit) => (
                                <div
                                    key={habit.habit_id}
                                    className="grid items-center gap-3"
                                    style={{
                                        gridTemplateColumns:
                                            `repeat(${daysInMonth}, 1.5rem) 4rem`,
                                    }}
                                >
                                    {days.map((day) => {
                                        if (!shouldShowDay(habit, day)) {
                                            return (
                                                <div
                                                    key={day}
                                                    className="h-6 w-6"
                                                />
                                            );
                                        }

                                        const key = `${habit.habit_id}-${day}`;
                                        const checked = completed[key];
                                        return (
                                            <label key={day}>
                                                <input
                                                    type="checkbox"
                                                    disabled={day > currentDay}
                                                    checked={checked || false}
                                                    onChange={() =>
                                                        toggleDay(habit, day)
                                                    }
                                                    className="hidden"
                                                />
                                                <div
                                                    className={`h-6 w-6 rounded-full border transition-all ${day > currentDay
                                                        ? "bg-maomao-night opacity-40"
                                                        : "cursor-pointer"
                                                        }`}
                                                    style={{
                                                        backgroundColor:
                                                            checked
                                                                ? habit.color
                                                                : undefined,
                                                        borderColor:
                                                            checked
                                                                ? "transparent"
                                                                : day > currentDay
                                                                    ? "#344d3b"
                                                                    : habit.color,
                                                    }}
                                                />
                                            </label>
                                        );
                                    })}
                                    {/* COMPLETED COUNT */}
                                    <div className="text-right text-sm text-[#b6c8a5]">
                                        {getCompletedCount(habit)}                                        /                                        {getTotalDays(habit)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="mt-6 w-80 rounded-xl border border-[#344d3b] bg-black/50 p-4 shadow-xl">
                        <h3 className="mb-3 text-center text-sm font-bold text-[#f5e8c8]">
                            {editingHabit ? "Edit Promise" : "New Promise"}
                        </h3>
                        {/* NAME */}
                        <label className="mb-2 block text-sm text-[#b6c8a5]">
                            Promise Name
                        </label>

                        <input
                            type="text"
                            value={newHabit}
                            onChange={(e) => setNewHabit(e.target.value)}
                            placeholder="Promise name..."
                            className="mb-3 w-full rounded-lg border border-[#49634d] bg-[#2b4234] px-3 py-2 text-sm text-[#f5e8c8] outline-none hover:border-[#89ad76] focus:border-green-500"
                            autoFocus
                        />
                        {/* FREQUENCY */}
                        <div className="mb-4">
                            <label className="mb-2 block text-sm text-[#b6c8a5]">
                                Frequency
                            </label>

                            <select
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="w-full rounded-lg border border-[#49634d] bg-[#2b4234] px-3 py-2 text-sm text-[#f5e8c8] outline-none hover:border-[#89ad76] focus:border-green-500"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekdays">Weekdays</option>
                                <option value="weekends">Weekends</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>

                        {/* COLOR */}
                        <div className="mb-4 flex items-center gap-3">
                            <label className="text-sm text-[#b6c8a5]">
                                Color
                            </label>

                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="h-8 w-8 cursor-pointer"
                            />
                        </div>

                        {/* BUTTONS */}
                        <div className="flex justify-end gap-2">

                            <button
                                onClick={closeModal}
                                className="rounded-lg px-3 py-1.5 text-sm text-[#b6c8a5] hover:text-[#f5e8c8]"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={
                                    editingHabit
                                        ? handleEditSave
                                        : handleAddHabit
                                }
                                className="rounded-lg bg-[#7fa36a] px-3 py-1.5 text-sm font-semibold text-[#f5e8c8] hover:bg-[#91b878]"
                            >
                                {editingHabit ? "Save" : "Add"}
                            </button>

                        </div>

                    </div>
                </div>
            )}

            {habitToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-black/60">
                    <div className="w-80 rounded-xl border border-[#344d3b] bg-maomao-forest p-6 shadow-2xl">

                        <h3 className="mb-3 text-lg font-bold text-[#f5e8c8]">
                            Delete Promise
                        </h3>

                        <p className="mb-6 text-sm text-[#b6c8a5]">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-[#f5e8c8]">
                                "{habitToDelete.name}"
                            </span>
                            ?
                            <br />
                            This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">

                            <button
                                onClick={() => setHabitToDelete(null)}
                                className="rounded-lg px-4 py-2 text-sm text-[#b6c8a5] hover:text-[#f5e8c8] border border-gray-400 cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDeleteHabit}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 cursor-pointer"
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

export default Calendar;