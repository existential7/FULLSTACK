import { useEffect, useReducer } from "react";
import { draftReducer } from "./draftReducer";
import { fetchDrafts, deleteDraft } from "./mockApi";

function DraftList({ onEdit }) {
  const [state, dispatch] = useReducer(draftReducer, {
    drafts: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    dispatch({ type: "LOADING" });
    fetchDrafts()
      .then((data) => dispatch({ type: "SET_DRAFTS", payload: data }))
      .catch((err) => dispatch({ type: "ERROR", payload: err.message }));
  }, []);

  const handleDelete = async (id) => {
    await deleteDraft(id);
    dispatch({ type: "REMOVE_DRAFT", payload: id });
  };

  if (state.loading) return <p>Loading drafts...</p>;
  if (state.error) return <p>Error: {state.error}</p>;

  return (
    <ul>
      {state.drafts.map((d) => (
        <li key={d.id}>
          {d.title}
          <button onClick={() => onEdit(d)}>Edit</button>
          <button onClick={() => handleDelete(d.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default DraftList;
