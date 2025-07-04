import { useState, useRef, useEffect } from "react";

type Fullscreenable = {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => void;
};

export default function App() {
  const [minutes, setMinutes] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
  if (isRunning && secondsLeft > 0) {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
  } else if (secondsLeft === 0 && isRunning) {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
}, [isRunning, secondsLeft]);

const resetTimer = () => {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
  setIsRunning(false);
  setSecondsLeft(0);
};


  const startTimer = () => {
    setSecondsLeft(minutes * 60);
    setIsRunning(true);
  };

  const handleFullscreen = () => {
    const el = document.documentElement as HTMLElement & Fullscreenable;

    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  };

  const formatTime = (secs: number) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div className="text-white text-9xl font-bold mb-8">
        {formatTime(secondsLeft)}
      </div>
      <div className="flex gap-4">
        <input
          type="number"
          className="w-24 p-2 text-center rounded"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          disabled={isRunning}
        />
        <button
          onClick={startTimer}
          disabled={isRunning}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Start
        </button>
        <button
          onClick={resetTimer}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Reset
        </button>
        <button
          onClick={handleFullscreen}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Fullscreen
        </button>
      </div>
    </div>
  );
}