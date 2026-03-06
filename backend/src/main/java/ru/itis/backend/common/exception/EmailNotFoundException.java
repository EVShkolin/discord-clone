package ru.itis.backend.common.exception;

public class EmailNotFoundException extends RuntimeException {

    public EmailNotFoundException(String email) {
        super("User with email " + email + " not found");
    }

}
