const API_URL = "http://localhost:8080/api/users";
let selectedUid = null;

const uidInput = document.getElementById("uid");
const nameInput = document.getElementById("name");
const message = document.getElementById("message");
const userTableBody = document.getElementById("userTableBody");
const searchResult = document.getElementById("searchResult");

document.getElementById("userForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const uid = uidInput.value.trim();
    const name = nameInput.value.trim();
    if (!uid || !name) {
        showMessage("UID and name are required.", false);
        return;
    }
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid, name })
        });
        const result = await response.json();
        showMessage(result.message, result.success);
        if (result.success) {
            clearForm();
            await loadUsers();
        }
    } catch (error) {
        showMessage("Unable to connect to the backend.", false);
    }
});

document.getElementById("updateBtn").addEventListener("click", async function () {
    if (!selectedUid) {
        showMessage("Please click Edit for a user first.", false);
        return;
    }
    const name = nameInput.value.trim();
    if (!name) {
        showMessage("Name is required.", false);
        return;
    }
    try {
        const response = await fetch(`${API_URL}/${selectedUid}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: selectedUid, name })
        });
        const result = await response.json();
        showMessage(result.message, result.success);
        if (result.success) {
            clearForm();
            await loadUsers();
        }
    } catch (error) {
        showMessage("Unable to connect to the backend.", false);
    }
});

document.getElementById("clearBtn").addEventListener("click", clearForm);
document.getElementById("refreshBtn").addEventListener("click", loadUsers);
document.getElementById("searchBtn").addEventListener("click", searchUser);

async function loadUsers() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        userTableBody.innerHTML = "";
        if (!result.success || !result.data || result.data.length === 0) {
            userTableBody.innerHTML = '<div class="empty">No users yet</div>';
            return;
        }
        result.data.forEach(user => {
            const card = document.createElement("article");
            card.className = "card";
            const uidEl = document.createElement("div");
            uidEl.className = "uid";
            uidEl.textContent = user.uid;
            const nameEl = document.createElement("div");
            nameEl.className = "name";
            nameEl.textContent = user.name;
            const actions = document.createElement("div");
            actions.className = "card-actions";

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "edit-btn";
            editButton.addEventListener("click", function () {
                editUser(user.uid, user.name);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";
            deleteButton.addEventListener("click", function () {
                deleteUser(user.uid);
            });

            actions.append(editButton, deleteButton);
            card.append(uidEl, nameEl, actions);
            userTableBody.appendChild(card);
        });
    } catch (error) {
        showMessage("Unable to connect to the backend.", false);
    }
}

function editUser(uid, name) {
    selectedUid = uid;
    uidInput.value = uid;
    nameInput.value = name;
    uidInput.disabled = true;
    showMessage("User selected. Change the name and click Update User.", true);
}

async function deleteUser(uid) {
    if (!confirm("Delete this user?")) return;
    try {
        const response = await fetch(`${API_URL}/${uid}`, { method: "DELETE" });
        const result = await response.json();
        showMessage(result.message, result.success);
        if (selectedUid === uid) clearForm();
        await loadUsers();
    } catch (error) {
        showMessage("Unable to connect to the backend.", false);
    }
}

async function searchUser() {
    const uid = document.getElementById("searchUid").value.trim();
    if (!uid) {
        searchResult.innerHTML = '<div class="search-err">Enter a UID</div>';
        return;
    }
    try {
        const response = await fetch(`${API_URL}/${uid}`);
        const result = await response.json();
        if (result.success) {
            searchResult.innerHTML =
                `<div class="search-ok">Found<br>UID: ${result.data.uid}<br>Name: ${result.data.name}</div>`;
        } else {
            searchResult.innerHTML = `<div class="search-err">${result.message}</div>`;
        }
    } catch (error) {
        searchResult.innerHTML = '<div class="search-err">Unable to connect to the backend.</div>';
    }
}

function clearForm() {
    uidInput.value = "";
    nameInput.value = "";
    uidInput.disabled = false;
    document.getElementById("searchUid").value = "";
    searchResult.innerHTML = "";
    selectedUid = null;
    showMessage("", true);
}

function showMessage(text, success) {
    message.textContent = text || "";
    message.style.color = success ? "#3dffc2" : "#ff6b4a";
}

loadUsers();
