package ru.itis.backend.server.internal.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.itis.backend.common.exception.ObjectNotFoundException;
import ru.itis.backend.server.api.dto.ChannelDto;
import ru.itis.backend.server.api.service.ChannelService;
import ru.itis.backend.server.internal.mapper.ChannelMapper;
import ru.itis.backend.server.internal.model.Channel;
import ru.itis.backend.server.internal.model.ChannelType;
import ru.itis.backend.server.internal.model.Server;
import ru.itis.backend.server.internal.repository.ChannelRepository;
import ru.itis.backend.server.internal.repository.ServerRepository;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ChannelServiceImpl implements ChannelService {

    private final ServerRepository serverRepository;

    private final ChannelRepository channelRepository;

    private final ChannelMapper channelMapper;

    @Override
    public List<ChannelDto> findAllByServerId(Long serverId) {
        log.debug("IN ChannelServiceImpl find all channels in server {}", serverId);
        List<Channel> channels = channelRepository.findAllByServerId(serverId);
        return channelMapper.toDtoList(channels);
    }

    @Override
    public ChannelDto create(Long serverId, ChannelDto channelDto) {
        log.info("IN ChannelServiceImpl create in server {} channel {}", serverId, channelDto);
        Server server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ObjectNotFoundException("Server", serverId));
        Channel channel = channelMapper.fromDto(channelDto);
        channel.setServer(server);

        return channelMapper.toDto(channelRepository.save(channel));
    }

    @Override
    @Transactional
    public List<ChannelDto> createBasicChannelsForServer(Server server) {
        log.debug("IN ChannelServiceImpl create basic channels for server {}", server.getId());
        List<Channel> channels = new ArrayList<>();
        Channel textChannel = Channel.builder()
                .name("general")
                .type(ChannelType.TEXT)
                .server(server)
                .userLimit(0)
                .build();
        channels.add(channelRepository.save(textChannel));

        Channel voiceChannel = Channel.builder()
                .name("General")
                .type(ChannelType.VOICE)
                .server(server)
                .userLimit(0)
                .build();
        channels.add(channelRepository.save(voiceChannel));
        return channelMapper.toDtoList(channels);
    }

    @Override
    public ChannelDto update(Long id, ChannelDto channelDto) {
        log.debug("IN ChannelServiceImpl update channel {}", id);
        Channel channel = channelRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Channel", id));

        channel.setName(channel.getName());
        if (channel.getType() == channelDto.getType()) {
            channel.setUserLimit(channel.getUserLimit());
        }

        return channelMapper.toDto(channel);
    }

    @Transactional
    @Override
    public void softDelete(Long id) {
        log.debug("IN ChannelServiceImpl soft delete {}", id);
        channelRepository.softDelete(id);
    }

}