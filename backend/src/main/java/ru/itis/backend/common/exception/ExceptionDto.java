package ru.itis.backend.common.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.http.HttpStatus;

import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ExceptionDto (
        Integer code,
        String message,
        Map<String, String> invalidArguments
) {

    public static ExceptionDto of(HttpStatus status, String message) {
        return new ExceptionDto(status.value(), message, null);
    }

    public static ExceptionDto validationErrors(Map<String, String> errors) {
        return new ExceptionDto(
                HttpStatus.BAD_REQUEST.value(),
                "Provided arguments are invalid",
                errors
        );
    }

}
