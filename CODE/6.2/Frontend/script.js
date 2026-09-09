const API_URL = "http://localhost:8080/api/users";
const userForm = document.getElementById("userForm");
const userTableBody = document.getElementById("userTableBody");
const status = document.getElementById("status");

async function loadUsers(type = "cached") {
    const startTime = performance.now();
    let endpoint = "/cached";
    if (type === "normal") endpoint = "/normal";
    else if (type === "optimized") endpoint = "/optimized";
    else if (type === "cached") endpoint = "/cached";
    else if (type === "native") endpoint = "/native";
    else if (type === "sort-id") endpoint = "/sort/id";
    else if (type === "sort-name") endpoint = "/sort/name";

    try {
        const response = await fetch(API_URL + endpoint);
        if (!response.ok) throw new Error("Request failed");
        const users = await response.json();
        const time = (performance.now() - startTime).toFixed(2);
        displayUsers(users, type);
        const label = type.replace("-", " ").toUpperCase();
        status.textContent = `${label} completed in ${time} ms`;
        status.className = "success";
    } catch (error) {
        status.textContent = "Unable to connect to backend.";
        status.className = "error";
    }
}

function displayUsers(users, type) {
    userTableBody.innerHTML = "";
    users.forEach(user => {
        let id, uid, name, city, country;
        if (type === "native") {
            id = user[0]; uid = user[1]; name = user[2]; city = user[3]; country = user[4];
        } else {
            id = user.id; uid = user.uid; name = user.name;
            if (user.address) { city = user.address.city; country = user.address.country; }
            else { city = ""; country = ""; }
        }
        const row = document.createElement("tr");
        [id, uid, name, city || "", country || ""].forEach(val => {
            const td = document.createElement("td");
            td.textContent = val;
            row.appendChild(td);
        });
        const act = document.createElement("td");
        const btn = document.createElement("button");
        btn.className = "delete-btn";
        btn.textContent = "Delete";
        btn.addEventListener("click", () => deleteUser(id));
        act.appendChild(btn);
        row.appendChild(act);
        userTableBody.appendChild(row);
    });
}

userForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const payload = {
        uid: document.getElementById("uid").value.trim(),
        name: document.getElementById("name").value.trim(),
        city: document.getElementById("city").value.trim(),
        country: document.getElementById("country").value.trim()
    };
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Unable to add user");
        userForm.reset();
        status.textContent = "User added successfully.";
        status.className = "success";
        loadUsers("cached");
    } catch (error) {
        status.textContent = error.message || "Unable to add user.";
        status.className = "error";
    }
});

async function deleteUser(id) {
    if (!confirm("Delete this user?")) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Unable to delete user");
        status.textContent = "User deleted successfully.";
        status.className = "success";
        loadUsers("cached");
    } catch (error) {
        status.textContent = "Unable to delete user.";
        status.className = "error";
    }
}

loadUsers("cached");
