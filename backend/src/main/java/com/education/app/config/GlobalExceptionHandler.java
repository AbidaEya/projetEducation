package com.education.app.config;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex,
            WebRequest request) {
        String raw = ex.getMostSpecificCause().getMessage();
        String friendly;
        if (raw != null && raw.toLowerCase().contains("email")) {
            friendly = "Cette adresse email existe déjà.";
        } else if (raw != null && raw.toLowerCase().contains("phone")) {
            friendly = "Ce numéro de téléphone existe déjà.";
        } else if (raw != null && (raw.toLowerCase().contains("null") || raw.toLowerCase().contains("not-null"))) {
            friendly = "Un champ obligatoire est manquant.";
        } else {
            friendly = "Erreur de contrainte : " + (raw != null ? raw : ex.getMessage());
        }
        return new ResponseEntity<>(new ApiResponse(false, friendly, null), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse> handleBadJson(HttpMessageNotReadableException ex, WebRequest request) {
        return new ResponseEntity<>(new ApiResponse(false, "Format de requête invalide.", null),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse> handleRuntimeException(RuntimeException ex, WebRequest request) {
        ApiResponse response = new ApiResponse(
                false,
                ex.getMessage(),
                null);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGlobalException(Exception ex, WebRequest request) {
        ApiResponse response = new ApiResponse(
                false,
                "Une erreur est survenue: " + ex.getMessage(),
                null);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
