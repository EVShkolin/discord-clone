package ru.itis.backend.user.internal.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.itis.backend.user.internal.exception.EmailNotFoundException;
import ru.itis.backend.common.exception.ObjectNotFoundException;
import ru.itis.backend.user.api.UserCreateDto;
import ru.itis.backend.user.api.UserDataDto;
import ru.itis.backend.user.api.UserDto;
import ru.itis.backend.user.api.UserService;
import ru.itis.backend.user.internal.mapper.UserMapper;
import ru.itis.backend.user.internal.model.User;
import ru.itis.backend.user.internal.model.UserStatus;
import ru.itis.backend.user.internal.repository.UserRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    private final PasswordEncoder encoder;

    @Override
    public Map<Long, UserDto> findAllByIds(List<Long> ids) {
        log.debug("IN UserServiceImpl find all by list of ids");
        return userRepository.findAllById(ids).stream()
                .map(userMapper::toDto)
                .collect(Collectors.toMap(UserDto::getId, u -> u));
    }

    @Override
    public UserDto findById(Long id) {
        log.debug("IN UserServiceImpl find by id {}", id);
        return userRepository.findById(id)
                .map(userMapper::toDto)
                .orElseThrow(() -> new ObjectNotFoundException("User", id));
    }

    @Override
    public UserDataDto findByEmail(String email) {
        log.debug("IN UserServiceImpl find by email {}", email);
        return userRepository.findByEmail(email)
                .map(u -> new UserDataDto(userMapper.toDto(u), u.getPasswordHash()))
                .orElseThrow(() -> new EmailNotFoundException(email));
    }

    @Override
    public UserDto save(UserCreateDto userDto) {
        log.debug("IN UserServiceImpl save new user {}", userDto);
        String passwordHash = encoder.encode(userDto.getPassword());
        User user = User.builder()
                .name(userDto.getName())
                .email(userDto.getEmail())
                .avatarUrl(userDto.getAvatarUrl())
                .status(UserStatus.ONLINE)
                .passwordHash(passwordHash)
                .build();
        user = userRepository.save(user);
        log.info("Created new user {}", user.getEmail());
        return userMapper.toDto(user);
    }

    @Override
    public void changePassword(Long id, String password) {
        log.debug("IN UserServiceImpl change password for user {}", id);
    }

    @Override
    public void changeUsername(Long id, String username) {
        log.debug("IN UserServiceImpl change username for user {}", id);
    }

    @Override
    public void changeEmail(Long id, String email) {
        log.debug("IN UserServiceImpl change email for user {}", id);
    }

    @Override
    public void softDelete(Long id) {
        log.debug("IN UserServiceImpl soft delete user {}", id);
        userRepository.softDelete(id);
    }

}
