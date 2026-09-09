import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, deletePost } from "./features/posts/postSlice";

function App() {
  const [text, setText] = useState("");
  const posts = useSelector((state) => state.posts.posts);
  const dispatch = useDispatch();

  const handleAdd = () => {
    if (text === "") return;
    dispatch(addPost({ id: Date.now(), text }));
    setText("");
  };

  return (
    <div>
      <h2>Redux Post Manager</h2>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter post"
      />
      <button onClick={handleAdd}>Add</button>
      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.text}</p>
          <button onClick={() => dispatch(deletePost(post.id))}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
