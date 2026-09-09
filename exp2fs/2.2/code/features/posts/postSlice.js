import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [
    { id: 1, text: "React Learning" },
    { id: 2, text: "Redux Toolkit" },
    { id: 3, text: "Memoized Selector" },
  ],
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
  },
});

export const { addPost, deletePost } = postSlice.actions;
export default postSlice.reducer;
