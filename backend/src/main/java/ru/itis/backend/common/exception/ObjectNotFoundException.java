package ru.itis.backend.common.exception;

public class ObjectNotFoundException extends RuntimeException {

    public <T> ObjectNotFoundException(String objectName, T id) {
        super(objectName + " with id " + id + " not found");
    }

}
