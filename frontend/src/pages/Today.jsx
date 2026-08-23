import { useState } from "react";
import useHabits from "../hooks/useHabits";

function Today({ user }) {

    const {
        completed,
        habitsLoading,
        logsLoading,
        toggleDay,
        getTodayHabits,
    } = useHabits(user);

    const [activeTab, setActiveTab] = useState("today");

    const today = new Date();

    const currentMonth = today.toLocaleString("default", {
        month: "long",
    });

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


    // ================================
    // TODAY'S HABITS
    // ================================

    const todayHabits = getTodayHabits();


    // ================================
    // SPLIT COMPLETED / INCOMPLETE
    // ================================

    const incompleteHabits = todayHabits.filter(
        (habit) =>
            !completed[`${habit.id}-${currentDay}`]
    );

    const completedHabits = todayHabits.filter(
        (habit) =>
            completed[`${habit.id}-${currentDay}`]
    );


    const completedToday = completedHabits.length;


    // ================================
    // HABIT ROW
    // ================================

    const renderHabit = (habit) => {

        const key = `${habit.id}-${currentDay}`;
        const checked = completed[key];

        return (
            <label
                key={habit.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 transition hover:bg-[#263b2b]"
            >

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

                        borderColor:
                            habit.color,
                    }}
                >
                    {checked && (
                        <span className="text-xs font-bold text-white">
                            ✓
                        </span>
                    )}
                </div>


                {/* HABIT INFO */}

                <div className="min-w-0 flex-1">

                    <div
                        className={`text-sm font-medium ${
                            checked
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


    return (
        <div className="min-h-screen bg-maomao-night p-3 text-[#f2ead8] sm:p-5 lg:p-8">

            <div className="rounded-xl border border-maomao-dark-border bg-maomao-forest p-6 shadow-lg">


                {/* ================================
                    HEADER
                ================================= */}

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


                {/* ================================
                    TABS
                ================================= */}

                <div className="mb-4 flex rounded-lg bg-[#1d3024] p-1">

                    <button
                        onClick={() =>
                            setActiveTab("today")
                        }
                        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
                            activeTab === "today"
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
                        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
                            activeTab === "completed"
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


                {/* ================================
                    CONTENT
                ================================= */}

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
                                            {todayHabits.length === 0
                                                ? "No activities scheduled for today."
                                                : "All promises completed!"}
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

            </div>

        </div>
    );
}

export default Today;