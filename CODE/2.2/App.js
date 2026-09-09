import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addPost, deletePost } from "./features/posts/postSlice";
import { selectAllPosts, selectPostCount } from "./PostSelector";

const PLATFORMS = [
  { id: "Twitter", label: "Twitter", limit: 280, accent: "twitter" },
  { id: "Instagram", label: "Instagram", limit: 2200, accent: "instagram" },
  { id: "Facebook", label: "Facebook", limit: 63206, accent: "facebook" },
  { id: "LinkedIn", label: "LinkedIn", limit: 3000, accent: "linkedin" },
];

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function App() {
  const [platform, setPlatform] = useState("Twitter");
  const [name, setName] = useState("");
  const [post, setPost] = useState("");
  const posts = useSelector(selectAllPosts);
  const count = useSelector(selectPostCount);
  const dispatch = useDispatch();

  const active = PLATFORMS.find((p) => p.id === platform);
  const remaining = active.limit - post.length;
  const overLimit = remaining < 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !post.trim() || overLimit) return;
    dispatch(
      addPost({
        id: Date.now(),
        platform,
        name: name.trim(),
        text: post.trim(),
        time: new Date().toISOString(),
      })
    );
    setName("");
    setPost("");
  };

  return (
    <div className="desk">
      <header>
        <span>Multi-channel composer</span>
        <h1>Transmission Desk</h1>
        <p>Pick a channel, draft the post, watch it go live in the preview. Total posts: {count}</p>
      </header>
      <form onSubmit={handleSubmit}>
        {PLATFORMS.map((p) => (
          <button type="button" key={p.id} onClick={() => setPlatform(p.id)}>
            {p.label}
          </button>
        ))}
        <input
          placeholder="Who's posting?"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          rows="6"
          placeholder={`Write your ${active.label} post...`}
          value={post}
          onChange={(e) => setPost(e.target.value)}
        />
        <p>
          {remaining} / {active.limit}
        </p>
        <button type="submit">Publish</button>
      </form>
      <ul>
        {posts.map((item) => (
          <li key={item.id}>
            {item.text || item.name}
            <button onClick={() => dispatch(deletePost(item.id))}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
