package com.example.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        try (FileWriter fw = new FileWriter("error_log.txt", true);
                PrintWriter pw = new PrintWriter(fw)) {
            pw.println("Timestamp: " + LocalDateTime.now());
            pw.println("Message: " + e.getMessage());
            e.printStackTrace(pw);
            pw.println("--------------------------------------------------");
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
