package com.education.app.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path rootDir;

    public FileStorageService(@Value("${app.upload.dir:./uploads}") String uploadDir) {
        this.rootDir = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public String store(MultipartFile file, String subdir) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Fichier manquant");
        }

        String original = file.getOriginalFilename();
        String ext = "";
        if (original != null) {
            int idx = original.lastIndexOf('.');
            if (idx >= 0 && idx < original.length() - 1) {
                ext = original.substring(idx).toLowerCase(Locale.ROOT);
            }
        }

        String safeSubdir = (subdir == null || subdir.trim().isEmpty()) ? "misc" : subdir.trim();
        String filename = UUID.randomUUID() + ext;

        try {
            Path dir = rootDir.resolve(safeSubdir).normalize();
            Files.createDirectories(dir);
            Path target = dir.resolve(filename).normalize();
            file.transferTo(target);
            // Expose via /uploads/** mapping
            return "/uploads/" + safeSubdir + "/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l'enregistrement du fichier", e);
        }
    }
}
