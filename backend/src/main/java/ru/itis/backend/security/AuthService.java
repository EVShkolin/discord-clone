package ru.itis.backend.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.itis.backend.user.api.UserDto;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final JwtProvider jwtProvider;

    public UserDto createLoginInfo(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String token = jwtProvider.createToken(authentication);

        UserDto user = userPrincipal.getUser();
        user.setToken(token);

        return user;
    }

}
