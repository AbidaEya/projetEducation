package com.education.app.service;

import com.education.app.model.User;
import com.education.app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public List<User> getAllActiveUsers() {
        return userRepository.findByIsActiveTrue();
    }
    
    public User updateUser(Long id, User userDetails) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            User existing = user.get();
            if (userDetails.getFirstName() != null) {
                existing.setFirstName(userDetails.getFirstName());
            }
            if (userDetails.getLastName() != null) {
                existing.setLastName(userDetails.getLastName());
            }
            if (userDetails.getEmail() != null) {
                existing.setEmail(userDetails.getEmail());
            }
            if (userDetails.getPhoneNumber() != null) {
                existing.setPhoneNumber(userDetails.getPhoneNumber());
            }
            if (userDetails.getAddress() != null) {
                existing.setAddress(userDetails.getAddress());
            }
            if (userDetails.getProfilePicture() != null) {
                existing.setProfilePicture(userDetails.getProfilePicture());
            }
            existing.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(existing);
        }
        return null;
    }

    public boolean changePassword(Long id, String currentPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Simple password check (in production, use BCrypt or similar)
            if (user.getPassword() != null && user.getPassword().equals(currentPassword)) {
                user.setPassword(newPassword);
                user.setUpdatedAt(LocalDateTime.now());
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }
    
    public void deactivateUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            User existing = user.get();
            existing.setIsActive(false);
            existing.setUpdatedAt(LocalDateTime.now());
            userRepository.save(existing);
        }
    }
    
    public void activateUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            User existing = user.get();
            existing.setIsActive(true);
            existing.setUpdatedAt(LocalDateTime.now());
            userRepository.save(existing);
        }
    }
    
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
