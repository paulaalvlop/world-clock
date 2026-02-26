import { formatTime, formatDate } from "../utils/timezones";

interface Props {
  timezone: string;
  now: Date;
  onRemove: () => void;
}

export default function TimeDisplay({ timezone, now, onRemove }: Props) {
  return (
    <div className="time-display">
      <button className="remove-btn" onClick={onRemove} aria-label="Remove timezone">
        &times;
      </button>
      <p className="timezone-name">{timezone.replace(/_/g, " ")}</p>
      <p className="time">{formatTime(timezone, now)}</p>
      <p className="date">{formatDate(timezone, now)}</p>
    </div>
  );
}
