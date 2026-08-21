import { useState, useEffect, useRef } from "react";
import AuthModal from "./components/AuthModal";
import { login, register } from "../services/authService";
import api from "../services/api";

function App() {
  // =====================================================
  // DATE / CONSTANTS
  const today = new Date();

  const currentMonth = today.toLocaleString("default", { month: "long", });
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

  // =====================================================
  // STATE
  const [habits, setHabits] = useState([
    {
      id: 1,
      name: "Make my bed",
      frequency: "daily",
      color: "#3b82f6",
    },
    {
      id: 2,
      name: "Read a book",
      frequency: "weekdays",
      color: "#e61010",
    },
    {
      id: 3,
      name: "Go for a walk",
      frequency: "weekends",
      color: "#22c55e",
    },
  ]);

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [habitsLoading, setHabitsLoading] = useState(false);
  const [completed, setCompleted] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [newHabit, setNewHabit] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const calendarRef = useRef(null);
  const todayRef = useRef(null);

  // =====================================================
  // EFFECTS
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setAuthLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      await getHabits();
      await getHabitLogs();
    };

    loadData();
  }, [user]);

  useEffect(() => {
    if (authLoading || habitsLoading) return;

    const scrollToToday = () => {
      if (window.innerWidth >= 1024) return;

      const container = calendarRef.current;
      if (!container) return;

      const dayWidth = 24;
      const gap = 12;
      const columnWidth = dayWidth + gap;

      const todayPosition = (currentDay - 1) * columnWidth;

      const targetScroll =
        todayPosition - container.clientWidth / 2 + dayWidth / 2;

      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: "smooth",
      });
    };

    const timer = setTimeout(scrollToToday, 100);

    return () => clearTimeout(timer);
  }, [authLoading, habitsLoading, currentDay]);

  useEffect(() => {
    if (!todayRef.current || !calendarRef.current) return;

    // Only auto-scroll on mobile
    if (window.innerWidth < 1024) {
      todayRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [daysInMonth]);


  // =====================================================
  // HELPERS
  const getWeekday = (day) => new Date(
    today.getFullYear(),
    today.getMonth(),
    day
  ).toLocaleDateString("default", {
    weekday: "short",
  });

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

  const getTotalDays = (habit) => days.filter((day) => shouldShowDay(habit, day)).length;

  const getCompletedCount = (habit) => days.filter((day) => completed[`${habit.id}-${day}`]).length;

  const getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;

  const [color, setColor] = useState(getRandomColor);

  const getTodayHabits = () => {
    const todayWeekday = today.getDay();

    return habits.filter((habit) => {
      switch (habit.frequency) {
        case "daily":
          return true;

        case "weekdays":
          return todayWeekday >= 1 && todayWeekday <= 5;

        case "weekends":
          return todayWeekday === 0 || todayWeekday === 6;

        case "custom":
          return true;

        default:
          return true;
      }
    });
  };

  const todayHabits = getTodayHabits();

  // =====================================================
  // API
  const getHabits = async () => {
    try {
      setHabitsLoading(true);

      const response = await api.get("/api/habits");

      setHabits(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setHabitsLoading(false);
    }
  };

  const getHabitLogs = async () => {
    try {
      const response = await api.get("/api/habit-logs");
      const completedMap = {};

      response.data.forEach((log) => {
        const day = new Date(log.completed_date).getDate();

        completedMap[`${log.habit_id}-${day}`] = true;
      });

      setCompleted(completedMap);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAuth = async (data) => {
    try {
      if (data.mode === "signin") {
        const response = await login(
          data.identifier,
          data.password
        );

        localStorage.setItem("token", response.token);
        localStorage.setItem(
          "user",
          JSON.stringify(response.user)
        );

        setUser(response.user);
      } else {
        const response = await register(
          data.username,
          data.email,
          data.password
        );

        console.log("Registered:", response);
      }

      setShowAuthModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  // =====================================================
  // FORM HELPERS
  const resetHabitForm = () => {
    setEditingHabit(null);
    setNewHabit("");
    setFrequency("daily");
    setColor("#22c55e");
    setShowModal(false);
  };

  const closeModal = () => {
    resetHabitForm();
  };

  // =====================================================
  // HABIT ACTIONS
  const toggleDay = async (habit, day) => {
    const key = `${habit.id}-${day}`;
    const checked = completed[key];

    if (!user) {
      setCompleted((prev) => ({
        ...prev,
        [key]: !checked,
      }));
      return;
    }

    try {
      const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        day
      )
        .toISOString()
        .split("T")[0];

      if (!checked) {
        await api.post("/api/habit-logs", {
          habitId: habit.id,
          date,
        });
      } else {
        await api.delete("/api/habit-logs", {
          data: {
            habitId: habit.id,
            date,
          },
        });
      }

      setCompleted((prev) => ({
        ...prev,
        [key]: !checked,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const addHabit = async () => {
    if (!newHabit.trim()) return;

    const habitData = {
      name: newHabit,
      frequency,
      color,
    };

    if (!user) {
      setHabits((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...habitData,
        },
      ]);
    } else {
      const response = await api.post(
        "/api/habits",
        habitData
      );

      setHabits((prev) => [
        ...prev,
        response.data.habit,
      ]);
    }

    resetHabitForm();
  };

  const editHabit = (habit) => {
    setEditingHabit(habit);
    setNewHabit(habit.name);
    setFrequency(habit.frequency);
    setColor(habit.color);
    setShowModal(true);
  };

  const editHabitSave = async () => {
    const habitData = {
      name: newHabit,
      frequency,
      color,
    };

    if (!user) {
      setHabits((prev) =>
        prev.map((habit) =>
          habit.id === editingHabit.id
            ? { ...habit, ...habitData }
            : habit
        )
      );
    } else {
      try {
        const response = await api.put(
          `/api/habits/${editingHabit.id}`,
          habitData
        );

        setHabits((prev) =>
          prev.map((habit) =>
            habit.id === editingHabit.id
              ? response.data.habit
              : habit
          )
        );
      } catch (error) {
        console.error(error);
      }
    }

    resetHabitForm();
  };

  const deleteHabit = async (id) => {
    if (!user) {
      setHabits((prev) =>
        prev.filter((habit) => habit.id !== id)
      );
    } else {
      try {
        await api.delete(`/api/habits/${id}`);

        setHabits((prev) =>
          prev.filter((habit) => habit.id !== id)
        );
      } catch (error) {
        console.error(error);
        return;
      }
    }

    setCompleted((prev) => {
      const updated = { ...prev };

      Object.keys(updated).forEach((key) => {
        if (key.startsWith(`${id}-`)) {
          delete updated[key];
        }
      });

      return updated;
    });

    setHabitToDelete(null);
  };

  if (habitsLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-maomao-night text-[#f5e8c8]">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-maomao-night p-3 sm:p-5 lg:p-8 text-[#f2ead8]">
        <div className="rounded-xl border border-maomao-dark-border bg-maomao-forest p-6 shadow-lg">
          {/* MAIN HEADER */}
          {/* ================= MOBILE HEADER ================= */}
          <div className="mb-6 lg:hidden">
            <div className="flex flex-col mb-3 text-center text-md font-medium italic tracking-wide text-[#b6c8a5]">
              <h1>
                KEEP YOUR PROMISES.
              </h1>
              <h1>
                Don't CHEAT on yourself!
              </h1>
            </div>

            <div className="flex justify-end">
              {user ? (
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7fa36a] font-semibold text-[#f5e8c8] transition hover:bg-[#91b878]"
                  title={user.username}
                >
                  {user.username[0].toUpperCase()}
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="rounded-lg bg-[#7fa36a] px-4 py-2 text-sm font-semibold text-[#f5e8c8]"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          {/* ================= DESKTOP HEADER ================= */}
          <div className="mb-6 hidden grid-cols-[auto_1fr_auto] items-center lg:grid">
            <h2 className="text-xl font-bold text-[#f5e8c8]">
              {currentMonth}
            </h2>

            <h1 className="text-center text-md font-medium italic tracking-wide text-[#b6c8a5]">
              KEEP YOUR PROMISES. Don't CHEAT on yourself.
            </h1>

            {user ? (
              <button
                className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#7fa36a] font-semibold text-[#f5e8c8] transition hover:bg-[#91b878]"
                title={user.username}
              >
                {user.username[0].toUpperCase()}
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="ml-auto rounded-lg bg-[#7fa36a] px-4 py-2 text-sm font-semibold text-[#f5e8c8]"
              >
                Sign In
              </button>
            )}
          </div>


{/* DAILY SECTION */}
<div className="mb-6 rounded-xl border border-[#344d3b] bg-[#1d3024] p-4">
  <div className="mb-4 flex items-center justify-between">
    <div>
      <h2 className="text-lg font-bold text-[#f5e8c8]">
        For Today
      </h2>

      <p className="text-xs text-[#829b7d]">
        {currentMonth} {currentDay} • {getWeekday(currentDay)}
      </p>
    </div>

    <div className="text-sm text-[#b6c8a5]">
      {getTodayHabits().filter(
        (habit) => completed[`${habit.id}-${currentDay}`]
      ).length}
      /
      {getTodayHabits().length}
    </div>
  </div>

  <div className="space-y-2">
    {getTodayHabits().map((habit) => {
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
            onChange={() => toggleDay(habit, currentDay)}
            className="hidden"
          />

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
    })}

    {getTodayHabits().length === 0 && (
      <p className="py-4 text-center text-sm text-[#829b7d]">
        No activities scheduled for today.
      </p>
    )}
  </div>
</div>

          <div className="flex flex-col gap-6 lg:flex-row">
            {/* SIDEBAR */}
            <div className="w-full space-y-3 lg:w-66 lg:shrink-0">
              {/* SIDEBAR HEADER */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#f5e8c8]">
                  Promises
                </h3>

                <button
                  onClick={() => {
                    setShowModal(true)
                    setColor(getRandomColor());
                  }}

                  className="rounded-md bg-[#7fa36a] px-2 py-1.5 text-xs text-[#f5e8c8] hover:bg-[#91b878]"
                >
                  + New
                </button>
              </div>

              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex w-full items-center justify-between"
                >
                  {/* HABIT CARD */}
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />

                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-[#e8dcc2]">
                        {habit.name}
                      </div>

                      <div className="text-xs text-[#829b7d]">
                        {habit.frequency}
                      </div>
                    </div>
                  </div>

                  {/* HABIT EDIT & DELETE */}
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => editHabit(habit)}
                      className="rounded px-1 text-blue-400 hover:text-blue-300"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => setHabitToDelete(habit)}
                      className="rounded px-1 text-red-400 hover:text-red-300"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="mb-4 text-xl font-bold text-[#f5e8c8] lg:hidden">
              {currentMonth}
            </h2>

            {/* CALENDAR */}
            <div
              ref={calendarRef}
              className="flex-1 overflow-x-auto"
            >
              {/* CALENDAR HEADER */}
              <div
                className="mb-4 grid items-center gap-3"
                style={{
                  gridTemplateColumns: `repeat(${daysInMonth}, 1.5rem) 4rem`,
                }}
              >
                {days.map((day) => (
                  <div
                    key={day}
                    ref={day === currentDay ? todayRef : null}
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


                <div className="text-xs text-[#829b7d] text-right">
                  Done
                </div>
              </div>

              {/* CALENDAR ROWS */}
              <div className="space-y-6 pb-5">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="grid items-center gap-3"
                    style={{
                      gridTemplateColumns: `repeat(${daysInMonth}, 1.5rem) 4rem`,
                    }}
                  >
                    {days.map((day) => {
                      if (!shouldShowDay(habit, day)) {
                        return <div key={day} className="h-6 w-6" />;
                      }

                      const key = `${habit.id}-${day}`;
                      const checked = completed[key];

                      return (
                        <label key={day}>
                          <input
                            type="checkbox"
                            disabled={day > currentDay}
                            checked={checked || false}
                            onChange={() => toggleDay(habit, day)}
                            className="hidden"
                          />

                          <div
                            className={`h-6 w-6 rounded-full border transition-all ${day > currentDay
                              ? "bg-maomao-night opacity-40"
                              : "cursor-pointer"
                              }`}
                            style={{
                              backgroundColor: checked ? habit.color : undefined,
                              borderColor: checked
                                ? "transparent"
                                : day > currentDay
                                  ? "#344d3b"
                                  : habit.color,
                            }}
                          />
                        </label>
                      );
                    })}

                    {/* Last column: count, aligned with "Done" above */}
                    <div className="text-sm text-[#b6c8a5] text-right">
                      {getCompletedCount(habit)}/{getTotalDays(habit)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

              <div className="mt-6 w-80 rounded-xl border border-[#344d3b] bg-black/50 p-4 p-4 shadow-xl">
                <h3 className="mb-3 text-center text-sm font-bold text-[#f5e8c8]">
                  {editingHabit ? "Edit Promise" : "New Promise"}
                </h3>

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

                <div className="flex justify-end gap-2">
                  <button
                    onClick={closeModal}
                    className="rounded-lg px-3 py-1.5 text-sm text-[#b6c8a5] hover:text-[#f5e8c8]"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={editingHabit ? editHabitSave : addHabit}
                    className="rounded-lg bg-[#7fa36a] px-3 py-1.5 text-sm font-semibold text-[#f5e8c8] hover:bg-[#91b878]"
                  >
                    {editingHabit ? "Save" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div >

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSubmit={handleAuth}
        />
      )}

      {habitToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-80 rounded-xl border border-[#344d3b] bg-maomao-forest p-6 shadow-2xl">
            <h3 className="mb-3 text-lg font-bold text-[#f5e8c8]">
              Delete Promise
            </h3>

            <p className="mb-6 text-sm text-[#b6c8a5]">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#f5e8c8]">
                "{habitToDelete.name}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setHabitToDelete(null)}
                className="rounded-lg px-4 py-2 text-sm text-[#b6c8a5] hover:text-[#f5e8c8]"
              >
                Cancel
              </button>

              <button
                onClick={() => deleteHabit(habitToDelete.id)}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
