package ru.itis.backend.server.internal.mapper;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import ru.itis.backend.server.api.dto.ServerMemberDto;
import ru.itis.backend.server.internal.model.ServerMember;
import ru.itis.backend.user.api.UserDto;

import java.util.Map;

@Component
public class ServerMemberMapper {

    public ServerMember fromDto(ServerMemberDto dto) {
        return ServerMember.builder()
                .userId(dto.getUserId())
                .build();
    }

    public ServerMemberDto toDto(ServerMember member, UserDto user) {
        return new ServerMemberDto(
                member.getId(),
                user.getId(),
                user.getName(),
                user.getAvatarUrl(),
                member.getServer().getId(),
                member.getCreatedAt()
        );
    }

    public Page<ServerMemberDto> toPageDto(Page<ServerMember> members, Map<Long, UserDto> users) {
        return members.map(m -> toDto(m, users.get(m.getUserId())));
    }

}
