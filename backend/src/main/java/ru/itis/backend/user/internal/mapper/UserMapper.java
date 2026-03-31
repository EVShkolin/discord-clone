package ru.itis.backend.user.internal.mapper;

import org.springframework.stereotype.Component;
import ru.itis.backend.user.api.UserDto;
import ru.itis.backend.user.internal.model.User;

@Component
public class UserMapper {

    public UserDto toDto(User user) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getAvatarUrl(),
                user.getStatus(),
                user.getCreatedAt()
        );
    }

}
