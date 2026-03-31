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

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/users")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthDto> createLoginInfo(Authentication authentication) {
        return ResponseEntity.ok(authService.createLoginInfo(authentication));
    }

    @PostMapping
    public ResponseEntity<AuthDto> register(@RequestBody @Valid UserCreateDto userDto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authService.registerUser(userDto));
    }

}
