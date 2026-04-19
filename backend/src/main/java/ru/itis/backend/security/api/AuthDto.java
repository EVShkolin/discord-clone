package ru.itis.backend.security.api;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.itis.backend.user.api.UserDto;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AuthDto {

    private UserDto user;

    private String token;

}
