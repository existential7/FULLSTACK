package com.example.experiment62.service;
import com.example.experiment62.dto.UserRequest;
import com.example.experiment62.model.Address;
import com.example.experiment62.model.User;
import com.example.experiment62.repository.UserRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) { this.userRepository = userRepository; }

    @CacheEvict(value = "users", allEntries = true)
    public User createUser(UserRequest request) {
        User user = new User(request.getUid(), request.getName());
        user.setAddress(new Address(request.getCity(), request.getCountry()));
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<User> getUsersNormal() {
        List<User> users = userRepository.findUsersNormal();
        users.forEach(user -> { if (user.getAddress() != null) user.getAddress().getCity(); });
        return users;
    }

    @Transactional(readOnly = true)
    public List<User> getUsersOptimized() {
        return userRepository.findUsersWithAddress();
    }

    @Cacheable(value = "users", key = "'allUsers'")
    @Transactional(readOnly = true)
    public List<User> getUsersCached() {
        return userRepository.findUsersWithAddress();
    }

    public List<Object[]> getUsersNative() {
        return userRepository.findUsersNative();
    }

    @Transactional(readOnly = true)
    public List<User> getUsersSortedById() {
        return userRepository.findAllByOrderByIdAsc();
    }

    @Transactional(readOnly = true)
    public List<User> getUsersSortedByName() {
        return userRepository.findAllByOrderByNameAsc();
    }

    @CacheEvict(value = "users", allEntries = true)
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
