import { useState, useMemo, useCallback, memo } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function dateKey(year, month, day) {
  return `${year}-${month + 1}-${day}`;
}

const DayCell = memo(function DayCell({ day, posts, onSelect, onDrop, onDragStart, onDelete }) {
  return (
    <div onClick={() => day && onSelect(day)} onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
      {day && (
        <>
          <div>{day}</div>
          {posts.map((post, i) => (
            <div key={i} draggable onDragStart={() => onDragStart(i)}>
              <span>{post}</span>
              <span onClick={(e) => { e.stopPropagation(); onDelete(i); }}>X</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
});

function App() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [posts, setPosts] = useState({});
  const [postText, setPostText] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);

  const cells = useMemo(() => getMonthGrid(year, month), [year, month]);

  const goPrevMonth = useCallback(() => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }, [month]);

  const goNextMonth = useCallback(() => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }, [month]);

  const addPost = useCallback(() => {
    if (!selectedDay || postText.trim() === "") return;
    const key = dateKey(year, month, selectedDay);
    setPosts((prev) => ({ ...prev, [key]: [...(prev[key] || []), postText.trim()] }));
    setPostText("");
  }, [selectedDay, postText, year, month]);

  return (
    <div>
      <h1>Post Scheduling Calendar</h1>
      <button onClick={goPrevMonth}>Prev</button>
      <h2>
        {MONTH_NAMES[month]} {year}
      </h2>
      <button onClick={goNextMonth}>Next</button>
      <div>
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
        {cells.map((day, idx) => {
          const key = day ? dateKey(year, month, day) : `empty-${idx}`;
          return (
            <DayCell
              key={key}
              day={day}
              posts={day ? posts[key] || [] : []}
              onSelect={setSelectedDay}
              onDrop={() => {
                if (!day || !draggedFrom) return;
                const targetKey = dateKey(year, month, day);
                if (draggedFrom.key === targetKey) return;
                setPosts((prev) => {
                  const moved = prev[draggedFrom.key][draggedFrom.index];
                  const next = { ...prev };
                  next[draggedFrom.key] = next[draggedFrom.key].filter((_, i) => i !== draggedFrom.index);
                  next[targetKey] = [...(next[targetKey] || []), moved];
                  return next;
                });
                setDraggedFrom(null);
              }}
              onDragStart={(i) => setDraggedFrom({ key, index: i })}
              onDelete={(i) =>
                setPosts((prev) => ({
                  ...prev,
                  [key]: prev[key].filter((_, idx2) => idx2 !== i),
                }))
              }
            />
          );
        })}
      </div>
      <input
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        placeholder="Write your post here..."
      />
      <button onClick={addPost}>Schedule Post</button>
    </div>
  );
}

export default App;
