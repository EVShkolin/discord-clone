package ru.itis.backend.message.internal.exception;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ru.itis.backend.common.exception.ExceptionDto;

@Order(1)
@RestControllerAdvice(basePackages = "ru.itis.backend.message.internal.controller")
public class MessageExceptionHandler {

    @ExceptionHandler(EmptyTextMessageException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    ExceptionDto handleEmptyTextMessageException(EmptyTextMessageException ex) {
        return ExceptionDto.of(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

}
