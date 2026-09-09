import { useState } from "react";

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

function App() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [posts, setPosts] = useState({});
  const [postText, setPostText] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);

  const cells = getMonthGrid(year, month);

  const goPrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const goNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const addPost = () => {
    if (!selectedDay || postText.trim() === "") return;
    const key = dateKey(year, month, selectedDay);
    const updated = { ...posts };
    updated[key] = [...(updated[key] || []), postText.trim()];
    setPosts(updated);
    setPostText("");
  };

  const deletePost = (key, index) => {
    const updated = { ...posts };
    updated[key] = updated[key].filter((_, i) => i !== index);
    setPosts(updated);
  };

  const handleDragStart = (key, index) => {
    setDraggedFrom({ key, index });
  };

  const handleDrop = (targetKey) => {
    if (!draggedFrom) return;
    if (draggedFrom.key === targetKey) {
      setDraggedFrom(null);
      return;
    }
    const updated = { ...posts };
    const movedPost = updated[draggedFrom.key][draggedFrom.index];
    updated[draggedFrom.key] = updated[draggedFrom.key].filter(
      (_, i) => i !== draggedFrom.index
    );
    updated[targetKey] = [...(updated[targetKey] || []), movedPost];
    setPosts(updated);
    setDraggedFrom(null);
  };

  return (
    <div className="app-container">
      <div className="coder-header">Post Scheduling Calendar</div>
      <div>
        <button onClick={goPrevMonth}>Prev</button>
        <h2>
          {MONTH_NAMES[month]} {year}
        </h2>
        <button onClick={goNextMonth}>Next</button>
      </div>
      <div className="grid">
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
        {cells.map((day, idx) => {
          const key = day ? dateKey(year, month, day) : `empty-${idx}`;
          const dayPosts = day ? posts[key] || [] : [];
          return (
            <div
              key={key}
              onClick={() => day && setSelectedDay(day)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => day && handleDrop(key)}
            >
              {day && (
                <>
                  <div>{day}</div>
                  {dayPosts.map((post, i) => (
                    <div
                      key={i}
                      draggable
                      onDragStart={() => handleDragStart(key, i)}
                    >
                      <span>{post}</span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePost(key, i);
                        }}
                      >
                        X
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>
      <p>
        {selectedDay
          ? `Selected day: ${selectedDay}`
          : "Select a day on the calendar to schedule a post."}
      </p>
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
