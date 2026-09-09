package com.example.experiment62.controller;
import com.example.experiment62.dto.UserRequest;
import com.example.experiment62.model.User;
import com.example.experiment62.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService) { this.userService = userService; }

    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(request));
    }
    @GetMapping("/normal")
    public ResponseEntity<List<User>> getUsersNormal() { return ResponseEntity.ok(userService.getUsersNormal()); }
    @GetMapping("/optimized")
    public ResponseEntity<List<User>> getUsersOptimized() { return ResponseEntity.ok(userService.getUsersOptimized()); }
    @GetMapping("/cached")
    public ResponseEntity<List<User>> getUsersCached() { return ResponseEntity.ok(userService.getUsersCached()); }
    @GetMapping("/native")
    public ResponseEntity<List<Object[]>> getUsersNative() { return ResponseEntity.ok(userService.getUsersNative()); }
    @GetMapping("/sort/id")
    public ResponseEntity<List<User>> getUsersSortedById() { return ResponseEntity.ok(userService.getUsersSortedById()); }
    @GetMapping("/sort/name")
    public ResponseEntity<List<User>> getUsersSortedByName() { return ResponseEntity.ok(userService.getUsersSortedByName()); }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
