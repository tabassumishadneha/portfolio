"use client";
import { useState, useEffect } from "react";

function generateSecret() {
  return Math.floor(Math.random() * 100) + 1;
}

export default function GuessingGame() {
  const [secret, setSecret] = useState(generateSecret());
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState("Guess a number between 1 and 100");
  const [status, setStatus] = useState<"playing" | "won">("playing");
  const [history, setHistory] = useState<{ guess: number; hint: string }[]>([]);

  function handleGuess() {
    const num = parseInt(guess);
    if (isNaN(num) || num < 1 || num > 100) {
      setMessage("Enter a valid number between 1–100");
      return;
    }
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    let hint = "";
    if (num === secret) {
      hint = "correct";
      setMessage(`You got it in ${newAttempts} attempt${newAttempts > 1 ? "s" : ""}! 🎉`);
      setStatus("won");
    } else if (num < secret) {
      hint = "too low";
      setMessage("Too low! Try higher.");
    } else {
      hint = "too high";
      setMessage("Too high! Try lower.");
    }
    setHistory((h) => [{ guess: num, hint }, ...h]);
    setGuess("");
  }

  function reset() {
    setSecret(generateSecret());
    setGuess("");
    setAttempts(0);
    setMessage("Guess a number between 1 and 100");
    setStatus("playing");
    setHistory([]);
  }

  return (
    <main className="min-h-screen bg-[#1a1a2e] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#16213e] rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-1">Number Guessing Game</h1>
        <p className="text-sm text-gray-400 mb-6">Interactive JS game — Attempt {attempts}</p>

        <p className="text-lg text-cyan-400 font-medium mb-6 min-h-[2rem]">{message}</p>

        {status === "playing" && (
          <div className="flex gap-3 mb-6">
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGuess()}
              placeholder="Your guess..."
              className="flex-1 bg-[#0f3460] text-white rounded-lg px-4 py-3 outline-none border border-transparent focus:border-cyan-500 transition"
            />
            <button
              onClick={handleGuess}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 rounded-lg transition"
            >
              Guess
            </button>
          </div>
        )}

        {status === "won" && (
          <button
            onClick={reset}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-lg transition mb-6"
          >
            Play Again
          </button>
        )}

        {history.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">History</p>
            {history.map((h, i) => (
              <div key={i} className="flex justify-between text-sm px-3 py-2 rounded-lg bg-[#0f3460]">
                <span className="text-white">Guessed: {h.guess}</span>
                <span className={h.hint === "correct" ? "text-green-400" : h.hint === "too low" ? "text-yellow-400" : "text-red-400"}>
                  {h.hint}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
