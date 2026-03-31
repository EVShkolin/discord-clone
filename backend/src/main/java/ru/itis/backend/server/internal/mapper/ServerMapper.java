package ru.itis.backend.server.internal.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import ru.itis.backend.server.api.dto.ServerDto;
import ru.itis.backend.server.internal.model.Server;

@Component
@RequiredArgsConstructor
public class ServerMapper {

    private final ChannelMapper channelMapper;

    public ServerDto toDto(Server server) {
        return ServerDto.builder()
                .id(server.getId())
                .name(server.getName())
                .description(server.getDescription())
                .iconUrl(server.getIconUrl())
                .creatorId(server.getCreatorId())
                .createdAt(server.getCreatedAt())
                .build();
    }

    public ServerDto toDtoWithChannels(Server server) {
        ServerDto serverDto = toDto(server);
        serverDto.setChannels(channelMapper.toDtoList(server.getChannels()));
        return serverDto;
    }

    public Server fromDto(ServerDto dto) {
        Long creatorId = ((Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getClaim("userId");
        return Server.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .iconUrl(dto.getIconUrl())
                .creatorId(creatorId)
                .build();
    }

}
