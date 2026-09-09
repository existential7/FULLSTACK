const API_URL = "http://localhost:8080/api/users";
const userForm = document.getElementById("userForm");
const uidInput = document.getElementById("uid");
const nameInput = document.getElementById("name");
const message = document.getElementById("message");
const userTableBody = document.getElementById("userTableBody");
const refreshBtn = document.getElementById("refreshBtn");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const formTitle = document.getElementById("formTitle");

let editingUid = null;

userForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const uid = uidInput.value.trim();
    const name = nameInput.value.trim();
    if (!uid || !name) {
        showMessage("UID and name are required.", false);
        return;
    }
    try {
        const response = await fetch(
            editingUid === null ? API_URL : `${API_URL}/${editingUid}`,
            {
                method: editingUid === null ? "POST" : "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uid: editingUid === null ? uid : editingUid,
                    name
                })
            }
        );
        const result = await response.json();
        showMessage(result.message, result.success);
        if (result.success) {
            resetForm();
            await loadUsers();
        }
    } catch (error) {
        showMessage("Unable to connect to the server.", false);
    }
});

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
            card.innerHTML = `
                <div class="uid">${user.uid}</div>
                <div class="name"></div>
                <div class="card-actions"></div>
            `;
            card.querySelector(".name").textContent = user.name;

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "edit-btn";
            editButton.addEventListener("click", function () {
                editingUid = user.uid;
                uidInput.value = user.uid;
                nameInput.value = user.name;
                uidInput.disabled = true;
                submitBtn.textContent = "Update";
                formTitle.textContent = "Edit record";
                cancelEditBtn.classList.remove("hidden");
                nameInput.focus();
                showMessage("Edit the name, then save.", true);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";
            deleteButton.addEventListener("click", function () {
                deleteUser(user.uid);
            });

            card.querySelector(".card-actions").append(editButton, deleteButton);
            userTableBody.appendChild(card);
        });
    } catch (error) {
        showMessage("Unable to load users.", false);
    }
}

async function deleteUser(uid) {
    if (!confirm("Delete this user?")) return;
    try {
        const response = await fetch(`${API_URL}/${uid}`, { method: "DELETE" });
        const result = await response.json();
        showMessage(result.message, result.success);
        if (editingUid === uid) resetForm();
        await loadUsers();
    } catch (error) {
        showMessage("Unable to delete user.", false);
    }
}

function resetForm() {
    userForm.reset();
    editingUid = null;
    submitBtn.textContent = "Save";
    formTitle.textContent = "New record";
    uidInput.disabled = false;
    cancelEditBtn.classList.add("hidden");
}

function showMessage(text, success) {
    message.textContent = text || "";
    message.style.color = success ? "#3dffc2" : "#ff6b4a";
}

cancelEditBtn.addEventListener("click", function () {
    resetForm();
    showMessage("", true);
});

refreshBtn.addEventListener("click", loadUsers);
loadUsers();
