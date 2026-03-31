package ru.itis.backend.user.internal.exception;

public class EmailNotFoundException extends RuntimeException {

    public EmailNotFoundException(String email) {
        super("User with email " + email + " not found");
    }

}
