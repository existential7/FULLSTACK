export function draftReducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true, error: null };
    case "SET_DRAFTS":
      return { ...state, loading: false, drafts: action.payload };
    case "UPSERT_DRAFT": {
      const exists = state.drafts.some((d) => d.id === action.payload.id);
      const drafts = exists
        ? state.drafts.map((d) =>
            d.id === action.payload.id ? action.payload : d
          )
        : [...state.drafts, action.payload];
      return { ...state, loading: false, drafts };
    }
    case "REMOVE_DRAFT":
      return {
        ...state,
        loading: false,
        drafts: state.drafts.filter((d) => d.id !== action.payload),
      };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
