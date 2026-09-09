const API_URL = "http://localhost:8080/api/users";
let currentPage = 0;

async function loadUsers(page) {
    currentPage = page;
    const pageSize = document.getElementById("pageSize").value;
    const sortField = document.getElementById("sortField").value;
    const sortDirection = document.getElementById("sortDirection").value;
    const url = `${API_URL}?page=${currentPage}&size=${pageSize}&sort=${sortField},${sortDirection}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to load users");
        const result = await response.json();
        const tableBody = document.getElementById("userTableBody");
        tableBody.innerHTML = "";

        if (!result.content || result.content.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3">No users found.</td></tr>';
        } else {
            result.content.forEach(user => {
                const row = document.createElement("tr");
                const uidTd = document.createElement("td");
                uidTd.textContent = user.uid;
                const nameTd = document.createElement("td");
                nameTd.textContent = user.name;
                const actTd = document.createElement("td");
                const btn = document.createElement("button");
                btn.className = "del";
                btn.textContent = "Delete";
                btn.addEventListener("click", () => deleteUser(user.uid));
                actTd.appendChild(btn);
                row.append(uidTd, nameTd, actTd);
                tableBody.appendChild(row);
            });
        }

        document.getElementById("pageInfo").textContent =
            `Page ${result.pageNumber + 1} of ${result.totalPages || 1}`;
        document.getElementById("totalInfo").textContent = `Total Users: ${result.totalElements}`;
        document.getElementById("previousButton").disabled = result.first;
        document.getElementById("nextButton").disabled = result.last;
    } catch (error) {
        showMessage("Unable to connect to the backend.");
    }
}

function previousPage() {
    if (currentPage > 0) loadUsers(currentPage - 1);
}

function nextPage() {
    loadUsers(currentPage + 1);
}

document.getElementById("userForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const uid = document.getElementById("uid").value.trim();
    const name = document.getElementById("name").value.trim();
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid, name })
        });
        if (response.ok) {
            showMessage("User added successfully.");
            document.getElementById("userForm").reset();
            loadUsers(0);
        } else {
            showMessage("Unable to add user.");
        }
    } catch (error) {
        showMessage("Unable to connect to the backend.");
    }
});

async function deleteUser(uid) {
    if (!confirm("Delete this user?")) return;
    try {
        const response = await fetch(`${API_URL}/${uid}`, { method: "DELETE" });
        if (response.ok) {
            showMessage("User deleted successfully.");
            loadUsers(currentPage);
        } else {
            showMessage("Unable to delete user.");
        }
    } catch (error) {
        showMessage("Unable to connect to the backend.");
    }
}

function showMessage(message) {
    document.getElementById("message").textContent = message;
}

loadUsers(0);
