package ru.itis.backend.server.api.service;

import ru.itis.backend.server.api.dto.ServerDto;

public interface ServerService {

    ServerDto findById(Long id);

    ServerDto create(ServerDto serverDto);

    ServerDto update(Long id, ServerDto serverDto);

    void softDelete(Long id);

}