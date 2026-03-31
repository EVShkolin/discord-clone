package ru.itis.backend.message.internal.exception;

public class EmptyTextMessageException extends RuntimeException {

    public EmptyTextMessageException() {
        super("Message cannot be empty");
    }

}
