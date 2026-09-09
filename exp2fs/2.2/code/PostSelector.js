import { createSelector } from "reselect";

const selectPosts = (state) => state.posts.posts;

export const selectAllPosts = createSelector([selectPosts], (posts) => posts);

export const selectPostCount = createSelector(
  [selectPosts],
  (posts) => posts.length
);
