package ru.itis.backend.server.api.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ru.itis.backend.server.api.dto.ServerMemberDto;
import ru.itis.backend.server.internal.model.Server;

public interface ServerMemberService {

    Page<ServerMemberDto> findAllByServer(Long serverId, Pageable pageable);

    void addMember(Long serverId, ServerMemberDto memberDto);

    void removeMember(Long memberId);

    void saveCreatorForServer(Server server);

}
