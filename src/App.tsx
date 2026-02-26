import { useState, useRef, useEffect } from "react";
import TimezoneSearch from "./components/TimezoneSearch";
import TimeDisplay from "./components/TimeDisplay";
import "./App.css";

export default function App() {
  const [timezones, setTimezones] = useState<string[]>([]);
  const [now, setNow] = useState(new Date());
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleSelect = (tz: string) => {
    setTimezones((prev) => {
      if (prev.length >= 5 || prev.includes(tz)) return prev;
      return [...prev, tz];
    });
  };

  const handleRemove = (tz: string) => {
    setTimezones((prev) => prev.filter((t) => t !== tz));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index;
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    dragOverItem.current = index;
    setOverIndex(index);
  };

  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const from = dragItem.current;
    const to = dragOverItem.current;
    if (from !== to) {
      setTimezones((prev) => {
        const updated = [...prev];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        return updated;
      });
    }
    resetDrag();
  };

  const resetDrag = () => {
    dragItem.current = null;
    dragOverItem.current = null;
    setDragIndex(null);
    setOverIndex(null);
  };

  const cardClass = (i: number) => {
    const classes = ["clock-card"];
    if (dragIndex === i) classes.push("dragging");
    if (overIndex === i && dragIndex !== null && dragIndex !== i) {
      classes.push(dragIndex < i ? "drop-below" : "drop-above");
    }
    return classes.join(" ");
  };

  return (
    <div className="app">
      <h1>World Clock</h1>
      <TimezoneSearch onSelect={handleSelect} maxReached={timezones.length >= 5} />
      <div className="clock-list">
        {timezones.map((tz, i) => (
          <div
            key={tz}
            className={cardClass(i)}
            draggable
            onDragStart={(e) => handleDragStart(e, i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDragLeave={() => setOverIndex(null)}
            onDrop={handleDrop}
            onDragEnd={resetDrag}
          >
            <span className="drag-handle" aria-hidden="true">⠿</span>
            <TimeDisplay timezone={tz} now={now} onRemove={() => handleRemove(tz)} />
          </div>
        ))}
      </div>
    </div>
  );
}
