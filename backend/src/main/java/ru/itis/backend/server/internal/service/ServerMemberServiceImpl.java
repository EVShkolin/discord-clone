package ru.itis.backend.server.internal.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import ru.itis.backend.common.exception.ObjectNotFoundException;
import ru.itis.backend.server.api.dto.ServerMemberDto;
import ru.itis.backend.server.api.service.ServerMemberService;
import ru.itis.backend.server.internal.mapper.ServerMemberMapper;
import ru.itis.backend.server.internal.model.Server;
import ru.itis.backend.server.internal.model.ServerMember;
import ru.itis.backend.server.internal.repository.ServerMemberRepository;
import ru.itis.backend.server.internal.repository.ServerRepository;
import ru.itis.backend.user.api.UserDto;
import ru.itis.backend.user.api.UserService;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class ServerMemberServiceImpl implements ServerMemberService {

    private final ServerMemberRepository memberRepository;

    private final ServerRepository serverRepository;

    private final ServerMemberMapper memberMapper;

    private final UserService userService;

    @Override
    public Page<ServerMemberDto> findAllByServer(Long serverId, Pageable pageable) {
        log.debug("IN ServerMemberServiceImpl find all by server {}", serverId);
        Page<ServerMember> members = memberRepository.findAllByServerId(serverId, pageable);
        Map<Long, UserDto> users = userService.findAllByIds(
                members.getContent()
                        .stream()
                        .map(ServerMember::getUserId)
                        .toList()
        );
        return memberMapper.toPageDto(members, users);
    }

    @Override
    public List<ServerMemberDto> findAllByUserIds(Long serverId, List<Long> userIds) {
        log.debug("IN ServerMemberServiceImpl find all by user ids");
        List<ServerMember> members = memberRepository.findByServer_idAndUserIdIn(serverId, userIds);
        Map<Long, UserDto> users = userService.findAllByIds(
                members.stream()
                        .map(ServerMember::getUserId)
                        .toList()
        );
        return memberMapper.toDtoList(members, users);
    }

    @Override
    public ServerMemberDto findByUserId(Long serverId, Long userId) {
        log.debug("IN ServerMemberServiceImpl find by user id {}", userId);
        UserDto user = userService.findById(userId);
        ServerMember member = memberRepository.findByServer_idAndUserId(serverId, userId)
                .orElseThrow(() -> new ObjectNotFoundException("User " + userId + " not found in server " + serverId));
        return memberMapper.toDto(member, user);
    }

    @Override
    public void addMember(Long serverId, ServerMemberDto memberDto) {
        log.debug("IN ServerMemberServiceImpl add member {} to server {}", memberDto, serverId);
        Server server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ObjectNotFoundException("Server", serverId));
        ServerMember member = memberMapper.fromDto(memberDto);
        member.setServer(server);
        memberRepository.save(member);
    }

    @Override
    public void removeMember(Long memberId) {
        log.debug("IN ServerMemberServiceImpl remove member {}", memberId);
        memberRepository.deleteById(memberId);
    }

    @Override
    public void saveCreatorForServer(Server server) {
        log.debug("IN ServerMemberServiceImpl saveCreatorForServer {}", server.getId());
        ServerMember member = ServerMember.builder()
                .userId(server.getCreatorId())
                .server(server)
                .build();
        memberRepository.save(member);
    }
}
