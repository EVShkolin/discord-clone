package ru.itis.backend.message.internal.exception;

import java.util.UUID;

public class MessageNotFoundException extends RuntimeException {

    public MessageNotFoundException(UUID id) {
        super("Message with id " + id.toString() + " not found");
    }

}
