# Experiment 5.1 — REST API User Management

Open this folder in VS Code. This is **5.1 only**. After you take screenshots, ask to upgrade the same project to **5.2**.

## What you need on your Mac

- JDK 17 or newer (`java -version`)
- Maven (`mvn -version`)  
  Install with Homebrew: `brew install maven`
- VS Code + **Live Server** extension (Ritwick Dey)
- Chrome

Java 25 from the lab sheet is fine. This project is set to Java 17 so it also runs on 17/21/25.

## Open in VS Code

1. Download / unzip `experiment5`.
2. VS Code → **File → Open Folder…** → select the `experiment5` folder (the one that contains `pom.xml`).
3. Install recommended extensions if prompted: Extension Pack for Java.

## Run the backend

In VS Code terminal (inside `experiment5`):

```bash
mvn spring-boot:run
```

Wait until you see `Started Experiment5Application`.

Check API:

- http://localhost:8080/api/users  
  Should return:

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": []
}
```

H2 console: http://localhost:8080/h2-console  
- JDBC URL: `jdbc:h2:mem:experiment5`  
- User: `sa`  
- Password: (empty)

## Run the frontend

1. Right-click `Frontend/index.html`
2. **Open with Live Server**
3. Chrome opens something like `http://127.0.0.1:5500/Frontend/index.html`

Keep the backend running while you use the UI.

## Test checklist (5.1)

- Add user (UID + Name)
- Refresh / list users
- Edit → change name → Update
- Delete → confirm
- Empty name / invalid body should show validation message
- CORS works from Live Server to `:8080`

## Project layout

```
experiment5
├── pom.xml
├── Frontend
│   ├── index.html
│   ├── style.css
│   └── script.js
└── src/main/java/com/example/experiment5
    ├── Experiment5Application.java
    ├── config/CorsConfig.java
    ├── controller/UserController.java
    ├── dto/ApiResponse.java
    ├── dto/UserRequest.java
    ├── exception/GlobalExceptionHandler.java
    ├── model/User.java
    ├── repository/UserRepository.java
    └── service/UserService.java
```

## Postman

| Method | URL | Body |
|---|---|---|
| POST | `http://localhost:8080/api/users` | `{ "uid": "E20454", "name": "Lovleen" }` |
| GET | `http://localhost:8080/api/users` | |
| GET | `http://localhost:8080/api/users/E20454` | |
| PUT | `http://localhost:8080/api/users/E20454` | `{ "uid": "E20454", "name": "Lovleen Kaur" }` |
| DELETE | `http://localhost:8080/api/users/E20454` | |
