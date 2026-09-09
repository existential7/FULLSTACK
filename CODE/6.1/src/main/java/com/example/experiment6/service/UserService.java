package com.example.experiment6.service;

import com.example.experiment6.dto.PageResponse;
import com.example.experiment6.dto.UserRequest;
import com.example.experiment6.model.User;
import com.example.experiment6.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(UserRequest request) {
        return userRepository.save(new User(request.getUid(), request.getName()));
    }

    public PageResponse<User> getUsers(Pageable pageable) {
        Page<User> page = userRepository.findAll(pageable);
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
    }

    public void deleteUser(String uid) {
        userRepository.deleteById(uid);
    }
}
