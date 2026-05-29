package ru.itis.backend.server.api.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ru.itis.backend.server.api.dto.ServerMemberDto;
import ru.itis.backend.server.internal.model.Server;

import java.util.List;

public interface ServerMemberService {

    Page<ServerMemberDto> findAllByServer(Long serverId, Pageable pageable);

    List<ServerMemberDto> findAllByUserIds(Long serverId, List<Long> userIds);

    ServerMemberDto findByUserId(Long serverId, Long userId);

    void addMember(Long serverId, ServerMemberDto memberDto);

    void removeMember(Long memberId);

    void saveCreatorForServer(Server server);

}
