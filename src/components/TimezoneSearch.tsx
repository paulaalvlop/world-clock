import { useState, useRef, useEffect, useCallback } from "react";
import { searchTimezones } from "../utils/timezones";
import type { TimezoneOption } from "../utils/timezones";

interface Props {
  onSelect: (timezone: string) => void;
  maxReached: boolean;
}

export default function TimezoneSearch({ onSelect, maxReached }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TimezoneOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setResults(searchTimezones(query));
    setActiveIndex(-1);
  }, [query]);

  const selectTimezone = useCallback(
    (tz: TimezoneOption) => {
      setQuery("");
      setIsOpen(false);
      onSelect(tz.id);
    },
    [onSelect]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectTimezone(results[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  return (
    <div className="search-container">
      <input
        ref={inputRef}
        type="text"
        value={query}
        placeholder={maxReached ? "Maximum 5 timezones" : "Search for a city or timezone..."}
        disabled={maxReached}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => query && setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        onKeyDown={handleKeyDown}
        className="search-input"
      />
      {isOpen && results.length > 0 && (
        <ul ref={listRef} className="search-dropdown">
          {results.map((tz, i) => (
            <li
              key={tz.id}
              className={`search-item ${i === activeIndex ? "active" : ""}`}
              onMouseDown={() => selectTimezone(tz)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              {tz.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
