package ru.itis.backend.user.api;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface UserService {

    Map<Long, UserDto> findAllByIds(List<Long> ids);

    UserDto findById(Long id);

    UserDataDto findByEmail(String email);

    UserDto save(UserCreateDto userDto);

    void changePassword(Long id, String password);

    void changeUsername(Long id, String username);

    void changeEmail(Long id, String email);

    void softDelete(Long id);

}
