package ru.itis.backend.user.api;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDataDto {

    private UserDto userDto;

    private String passwordHash;

}
