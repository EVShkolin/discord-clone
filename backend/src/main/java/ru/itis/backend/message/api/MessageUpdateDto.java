package ru.itis.backend.message.api;

import jakarta.validation.constraints.NotBlank;

public record MessageUpdateDto(@NotBlank String content) {}
