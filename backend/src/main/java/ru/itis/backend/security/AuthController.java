package ru.itis.backend.security;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.itis.backend.user.api.UserCreateDto;
import ru.itis.backend.user.api.UserDto;
import ru.itis.backend.user.api.UserService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/users")
public class AuthController {

    private final AuthService authService;

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<UserDto> createLoginInfo(Authentication authentication) {
        return ResponseEntity.ok(authService.createLoginInfo(authentication));
    }

    @PostMapping
    public ResponseEntity<UserDto> create(@RequestBody @Valid UserCreateDto userDto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.save(userDto));
    }

}
