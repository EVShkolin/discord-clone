package ru.itis.backend.server.internal.mapper;

import org.springframework.stereotype.Component;
import ru.itis.backend.server.api.dto.ServerDto;
import ru.itis.backend.server.internal.model.Server;

@Component
public class ServerMapper {

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

    public Server fromDto(ServerDto dto) {
        return Server.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .iconUrl(dto.getIconUrl())
                .creatorId(dto.getCreatorId())
                .build();
    }

}
