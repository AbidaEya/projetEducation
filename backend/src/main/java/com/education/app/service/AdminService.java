package com.education.app.service;

import com.education.app.model.Admin;
import com.education.app.repository.AdminRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Optional<Admin> getAdminByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    public Admin updateAdmin(Long id, Admin adminDetails) {
        Optional<Admin> admin = adminRepository.findById(id);
        if (admin.isPresent()) {
            Admin existing = admin.get();
            if (adminDetails.getEmail() != null) {
                existing.setEmail(adminDetails.getEmail());
            }
            if (adminDetails.getPassword() != null && !adminDetails.getPassword().isEmpty()) {
                existing.setPassword(adminDetails.getPassword());
            }
            if (adminDetails.getFirstName() != null) {
                existing.setFirstName(adminDetails.getFirstName());
            }
            if (adminDetails.getLastName() != null) {
                existing.setLastName(adminDetails.getLastName());
            }
            if (adminDetails.getPhoneNumber() != null) {
                existing.setPhoneNumber(adminDetails.getPhoneNumber());
            }
            if (adminDetails.getAddress() != null) {
                existing.setAddress(adminDetails.getAddress());
            }
            if (adminDetails.getProfilePicture() != null) {
                existing.setProfilePicture(adminDetails.getProfilePicture());
            }
            if (adminDetails.getIsActive() != null) {
                existing.setIsActive(adminDetails.getIsActive());
            }
            return adminRepository.save(existing);
        }
        return null;
    }

    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }
}
