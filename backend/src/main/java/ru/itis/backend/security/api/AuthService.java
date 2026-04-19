package ru.itis.backend.security.api;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.itis.backend.security.internal.JwtProvider;
import ru.itis.backend.user.api.UserCreateDto;
import ru.itis.backend.user.api.UserDto;
import ru.itis.backend.user.api.UserService;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final JwtProvider jwtProvider;

    private final UserService userService;

    public AuthDto createLoginInfo(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String token = jwtProvider.createToken(authentication);

        UserDto user = userPrincipal.getUser();
        return new AuthDto(user, token);
    }

    public AuthDto registerUser(UserCreateDto userDto) {
        UserDto user = userService.save(userDto);
        String token = jwtProvider.createToken(
                new UsernamePasswordAuthenticationToken(
                        new UserPrincipal(user, null),
                        null
                ));
        return new AuthDto(user, token);
    }

}
