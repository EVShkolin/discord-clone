package ru.itis.backend.server.internal.mapper;

import org.springframework.stereotype.Component;
import ru.itis.backend.server.api.dto.ChannelDto;
import ru.itis.backend.server.internal.model.Channel;

import java.util.List;

@Component
public class ChannelMapper {

    public ChannelDto toDto(Channel channel) {
        return new ChannelDto(
                channel.getId(),
                channel.getName(),
                channel.getServer().getId(),
                channel.getType(),
                channel.getUserLimit()
        );
    }

    public List<ChannelDto> toDtoList(List<Channel> channels) {
        return channels.stream()
                .map(this::toDto)
                .toList();
    }

    public Channel fromDto(ChannelDto dto) {
        return Channel.builder()
                .name(dto.getName())
                .type(dto.getType())
                .userLimit(dto.getUserLimit())
                .build();
    }

}
