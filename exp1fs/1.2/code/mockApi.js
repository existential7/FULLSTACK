let drafts = [];
let nextId = 1;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function saveDraft(draft) {
  await delay(500);
  if (draft.id) {
    drafts = drafts.map((d) =>
      d.id === draft.id ? { ...draft, lastModified: Date.now() } : d
    );
  } else {
    draft = { ...draft, id: nextId++, lastModified: Date.now() };
    drafts.push(draft);
  }
  return draft;
}

export async function fetchDrafts() {
  await delay(500);
  return [...drafts];
}

export async function deleteDraft(id) {
  await delay(300);
  drafts = drafts.filter((d) => d.id !== id);
  return id;
}
