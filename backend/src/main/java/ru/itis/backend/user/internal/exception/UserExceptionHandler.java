package ru.itis.backend.user.internal.exception;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ru.itis.backend.common.exception.ExceptionDto;

@Order(1)
@RestControllerAdvice(basePackages = "ru.itis.backend.user.internal.controller")
public class UserExceptionHandler {

    @ExceptionHandler(EmailNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    ExceptionDto handleEmailNotFoundException(EmailNotFoundException ex) {
        return ExceptionDto.of(HttpStatus.NOT_FOUND, ex.getMessage());
    }

}
