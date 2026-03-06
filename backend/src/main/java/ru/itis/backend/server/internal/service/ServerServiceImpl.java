package ru.itis.backend.server.internal.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.itis.backend.common.exception.ObjectNotFoundException;
import ru.itis.backend.server.api.dto.ChannelDto;
import ru.itis.backend.server.api.dto.ServerDto;
import ru.itis.backend.server.api.service.ChannelService;
import ru.itis.backend.server.api.service.ServerMemberService;
import ru.itis.backend.server.api.service.ServerService;
import ru.itis.backend.server.internal.mapper.ChannelMapper;
import ru.itis.backend.server.internal.mapper.ServerMapper;
import ru.itis.backend.server.internal.model.Server;
import ru.itis.backend.server.internal.repository.ServerRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ServerServiceImpl implements ServerService {

    private final ServerRepository serverRepository;

    private final ChannelService channelService;

    private final ServerMemberService serverMemberService;

    private final ServerMapper serverMapper;

    private final ChannelMapper channelMapper;

    @Override
    public ServerDto findById(Long id) {
        log.debug("IN ServerServiceImpl find by id {}", id);
        Server server = serverRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Server", id));

        ServerDto serverDto = serverMapper.toDto(server);
        serverDto.setChannels(channelMapper.toDtoList(server.getChannels()));

        return serverDto;
    }

    @Override
    @Transactional
    public ServerDto create(ServerDto serverDto) {
        log.debug("IN ServerServiceImpl create {}", serverDto);
        Server server = serverMapper.fromDto(serverDto);
        server = serverRepository.save(server);
        List<ChannelDto> channels = channelService.createBasicChannelsForServer(server);
        serverMemberService.saveCreatorForServer(server);

        log.info("Created new server (server_id: {}, creator_id: {})", server.getId(), server.getCreatorId());
        ServerDto createdServerDto = serverMapper.toDto(server);
        createdServerDto.setChannels(channels);
        return createdServerDto;
    }

    @Override
    @Transactional
    public ServerDto update(Long id, ServerDto serverDto) {
        log.debug("IN ServerServiceImpl update {}", id);
        Server server = serverRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Server", id));

        server.setName(serverDto.getName());
        server.setDescription(serverDto.getDescription());
        server.setIconUrl(serverDto.getIconUrl());
        return serverMapper.toDto(server);
    }

    @Transactional
    @Override
    public void softDelete(Long id) {
        log.debug("IN ServerServiceImpl soft delete {}", id);
        serverRepository.softDelete(id);
        log.info("Soft deleted server {}", id);
    }

}
