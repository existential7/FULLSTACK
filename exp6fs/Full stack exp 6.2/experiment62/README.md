# Experiment 6.2 — Caching & Query Optimization

Spring Boot 3.4.3 + JPA + H2 + simple cache.

## What it demonstrates
- Normal lazy query vs JOIN FETCH (avoids N+1)
- Native SQL query
- `@Cacheable` / `@CacheEvict` on the users list
- Sort by ID and by name

## Run backend (VS Code)
1. Open the `experiment62` folder in VS Code.
2. Install Extension Pack for Java if needed.
3. Open `src/main/java/com/example/experiment62/Experiment62Application.java`.
4. Click **Run**.
5. Backend: http://localhost:8080

Or from a terminal in this folder (Windows):

```bat
.\mvnw.cmd spring-boot:run
```

Stop any earlier experiment still using port 8080 first.

## Run frontend
Open `Frontend/index.html` with Live Server (port 5500). The page talks to `http://localhost:8080/api/users`.

## Endpoints
- POST `/api/users`
- GET `/api/users/normal`
- GET `/api/users/optimized`   (JOIN FETCH)
- GET `/api/users/cached`
- GET `/api/users/native`
- GET `/api/users/sort/id`
- GET `/api/users/sort/name`
- DELETE `/api/users/{id}`

H2 console: http://localhost:8080/h2-console  
JDBC URL: `jdbc:h2:mem:experiment62`  user: `sa`  password: empty
