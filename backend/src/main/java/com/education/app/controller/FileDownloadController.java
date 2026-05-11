package com.education.app.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileDownloadController {

    private final Path uploadPath;

    public FileDownloadController(@Value("${app.upload.dir:./uploads}") String uploadDir) {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    /**
     * Télécharger un fichier depuis le dossier uploads.
     * Usage: GET /api/files/download?path=/uploads/cours/xxx.pdf
     * ou: GET /api/files/download?path=cours/xxx.pdf
     */
    @GetMapping("/download")
    public ResponseEntity<Resource> downloadFile(@RequestParam("path") String filePath) {
        try {
            // Nettoyer le chemin (enlever /uploads/ prefix si présent)
            String cleanPath = filePath;
            if (cleanPath.startsWith("/uploads/")) {
                cleanPath = cleanPath.substring("/uploads/".length());
            } else if (cleanPath.startsWith("uploads/")) {
                cleanPath = cleanPath.substring("uploads/".length());
            }

            Path targetPath = uploadPath.resolve(cleanPath).normalize();

            // Sécurité: vérifier que le fichier est dans le dossier uploads
            if (!targetPath.startsWith(uploadPath)) {
                return ResponseEntity.badRequest().build();
            }

            if (!Files.exists(targetPath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(targetPath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // Déterminer le content type
            String contentType;
            try {
                contentType = Files.probeContentType(targetPath);
            } catch (IOException e) {
                contentType = "application/octet-stream";
            }
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            String filename = targetPath.getFileName().toString();

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Télécharger un fichier en forçant le téléchargement (attachment).
     */
    @GetMapping("/download-attachment")
    public ResponseEntity<Resource> downloadFileAsAttachment(@RequestParam("path") String filePath) {
        try {
            String cleanPath = filePath;
            if (cleanPath.startsWith("/uploads/")) {
                cleanPath = cleanPath.substring("/uploads/".length());
            } else if (cleanPath.startsWith("uploads/")) {
                cleanPath = cleanPath.substring("uploads/".length());
            }

            Path targetPath = uploadPath.resolve(cleanPath).normalize();

            if (!targetPath.startsWith(uploadPath)) {
                return ResponseEntity.badRequest().build();
            }

            if (!Files.exists(targetPath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(targetPath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType;
            try {
                contentType = Files.probeContentType(targetPath);
            } catch (IOException e) {
                contentType = "application/octet-stream";
            }
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            String filename = targetPath.getFileName().toString();

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
