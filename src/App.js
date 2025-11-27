// Siya - Goal Planner React App (Final Advanced Version)
// Features: Daily Goals, Monthly Goals, History, Auto-transfer system,
// Moving emojis, Notifications, Progress bar, Animations, Reminders, Siya Logo
// Tech: React + TailwindCSS

import React, { useState, useEffect } from "react";

export default function App() {
  const [goals, setGoals] = useState([]); // Daily goals
  const [monthlyGoals, setMonthlyGoals] = useState([]); // Monthly completed goals
  const [history, setHistory] = useState([]); // Pending & old goals
  const [input, setInput] = useState("");
  const [reminder, setReminder] = useState("");
  const [notification, setNotification] = useState(null);

  const emojis = [
    "🧠","💡","🔥","🚀","🎯","🌟","📈","💪",
    "✨","⚡","🌈","🎉","🪐","💫","🌺"
  ];

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  // Add daily goal
  const addGoal = () => {
    if (!input.trim()) return;

    const newGoal = {
      id: Date.now(),
      text: input,
      completed: false,
      reminder,
    };

    setGoals([...goals, newGoal]);
    setInput("");
    setReminder("");
    showNotification("🎯 Goal Added Successfully!");
  };

  // Delete from daily
  const deleteGoal = (id) => {
    setGoals(goals.filter((g) => g.id !== id));
    showNotification("🗑️ Goal Deleted!");
  };

  // Toggle completion
  const toggleComplete = (id) => {
    setGoals(
      goals.map((g) =>
        g.id === id ? { ...g, completed: !g.completed } : g
      )
    );
    showNotification("✅ Goal Updated!");
  };

  // NEW: Move goal to pending history
  const moveToPending = (goal) => {
    const today = new Date().toDateString();

    setHistory((prev) => [
      ...prev,
      { ...goal, movedOn: today }
    ]);

    setGoals(goals.filter((g) => g.id !== goal.id));

    showNotification("⏳ Goal Moved to Pending!");
  };

  // Reminder Trigger
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toISOString().slice(0, 16);
      goals.forEach((g) => {
        if (g.reminder && g.reminder === now) {
          alert(`🔔 Reminder: ${g.text}`);
        }
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [goals]);

  // Automatic Daily → Monthly / History Transfer
  useEffect(() => {
    const autoTransfer = setInterval(() => {
      const today = new Date().toDateString();

      const dailyCompleted = goals.filter((g) => g.completed);
      const dailyPending = goals.filter((g) => !g.completed);

      if (dailyCompleted.length > 0) {
        setMonthlyGoals((prev) => [
          ...prev,
          ...dailyCompleted.map((g) => ({ ...g, movedOn: today }))
        ]);
      }

      if (dailyPending.length > 0) {
        setHistory((prev) => [
          ...prev,
          ...dailyPending.map((g) => ({ ...g, movedOn: today }))
        ]);
      }

      if (goals.length > 0) {
        setGoals([]);
        showNotification("📅 Daily Goals Transferred Automatically!");
      }

    }, 60000);

    return () => clearInterval(autoTransfer);
  }, [goals]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 text-white overflow-hidden">

      {/* Siya Logo */}
      <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-white/30">
        <h2 className="text-3xl font-bold tracking-wide drop-shadow-md">
          Siya 🌸
        </h2>
      </div>

      {/* Moving Emoji Background */}
      {emojis.map((e, index) => (
        <span
          key={index}
          className="absolute text-6xl opacity-40 animate-bounce"
          style={{
            top: `${Math.random() * 90}%`,
            left: `${Math.random() * 90}%`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        >
          {e}
        </span>
      ))}

      <h1 className="text-center text-4xl font-bold py-6 drop-shadow-lg">
        Siya – Goal Planner
      </h1>

      {/* Input Section */}
      <div className="px-4 max-w-md mx-auto bg-white/20 backdrop-blur-lg p-4 rounded-2xl shadow-lg">
        <input
          type="text"
          placeholder="Enter your daily goal…"
          className="w-full p-3 rounded-xl text-black mb-3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <input
          type="datetime-local"
          className="w-full p-3 rounded-xl text-black mb-3"
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
        />

        <button
          onClick={addGoal}
          className="w-full bg-green-500 hover:bg-green-600 p-3 rounded-xl font-semibold shadow-lg transition"
        >
          Add Goal
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-white text-black px-5 py-3 rounded-xl shadow-xl animate-pulse">
          {notification}
        </div>
      )}

      {/* DAILY GOALS */}
      <h2 className="text-2xl font-bold mt-6 px-4">📅 Daily Goals</h2>
      <div className="mt-3 px-4 pb-6">
        {goals.length === 0 && <p className="opacity-80">No daily goals.</p>}
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-white/20 backdrop-blur-xl p-4 mb-4 rounded-2xl shadow-lg animate-fadeIn"
          >
            <div className="flex justify-between items-start">
              <p className={`text-lg font-semibold ${goal.completed ? "line-through opacity-70" : ""}`}>
                {goal.text}
              </p>

              <button
                onClick={() => deleteGoal(goal.id)}
                className="text-red-300 hover:text-red-500 text-xl"
              >
                ✖
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-black/20 rounded-xl mt-3">
              <div
                className={`h-full rounded-xl transition-all ${
                  goal.completed ? "bg-green-400 w-full" : "bg-yellow-300 w-2/4"
                }`}
              ></div>
            </div>

            {/* BUTTONS: COMPLETE + PENDING */}
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => toggleComplete(goal.id)}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl text-sm shadow-md"
              >
                {goal.completed ? "Undo" : "Complete"}
              </button>

              {/* NEW PENDING BUTTON */}
              <button
                onClick={() => moveToPending(goal)}
                className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-xl text-sm text-black shadow-md"
              >
                Pending
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MONTHLY GOALS */}
      <h2 className="text-2xl font-bold mt-6 px-4">📆 Monthly Completed Goals</h2>
      <div className="px-4">
        {monthlyGoals.length === 0 && <p className="opacity-80">No monthly goals yet.</p>}
        {monthlyGoals.map((m) => (
          <div key={m.id} className="bg-white/20 p-3 mt-3 rounded-xl">
            <p className="font-semibold">{m.text}</p>
            <p className="text-sm opacity-80">Completed on: {m.movedOn}</p>
          </div>
        ))}
      </div>

      {/* HISTORY */}
      <h2 className="text-2xl font-bold mt-6 px-4">📜 History (Pending & Old Goals)</h2>
      <div className="px-4 mb-10 pb-10">
        {history.length === 0 && <p className="opacity-80">No history yet.</p>}
        {history.map((h) => (
          <div key={h.id} className="bg-white/20 p-3 mt-3 rounded-xl">
            <p className="font-semibold">{h.text}</p>
            <p className="text-sm opacity-80">Moved on: {h.movedOn}</p>
          </div>
        ))}
      </div>
    </div>
  );
}