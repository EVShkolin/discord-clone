package ru.itis.backend.user.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateDto {

    @NotBlank
    @Size(max = 50)
    private String name;

    @Email
    @NotNull
    private String email;

    @NotBlank
    @Size(min = 8)
    private String password;

    private String avatarUrl;

}
