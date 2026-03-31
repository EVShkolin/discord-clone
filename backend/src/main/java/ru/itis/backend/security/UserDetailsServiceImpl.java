package ru.itis.backend.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import ru.itis.backend.user.api.UserDataDto;
import ru.itis.backend.user.api.UserService;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserService userService;

    @Override
    @NonNull
    public UserDetails loadUserByUsername(@NonNull String email) {
        log.debug("IN UserDetailsServiceImpl loading user details for {}", email);
        UserDataDto userData = userService.findByEmail(email);
        return new UserPrincipal(userData.getUserDto(), userData.getPasswordHash());
    }

}
