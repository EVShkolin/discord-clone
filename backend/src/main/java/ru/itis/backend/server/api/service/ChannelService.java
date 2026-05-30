package ru.itis.backend.server.api.service;

import ru.itis.backend.server.api.dto.ChannelDto;
import ru.itis.backend.server.internal.model.Server;

import java.util.List;

public interface ChannelService {

    ChannelDto findById(Long id);

    ChannelDto findById(Long serverId, Long channelId);

    List<ChannelDto> findAllByServerId(Long serverId);

    ChannelDto create(Long serverId, ChannelDto channelDto);

    List<ChannelDto> createBasicChannelsForServer(Server server);

    ChannelDto update(Long id, ChannelDto channelDto);

    void softDelete(Long id);

}
