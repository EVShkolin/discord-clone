package ru.itis.backend.server.internal.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.itis.backend.server.api.dto.ServerMemberDto;
import ru.itis.backend.server.api.service.ServerMemberService;

@RestController
@RequestMapping("/api/v1/servers/{serverId}/members")
@RequiredArgsConstructor
public class ServerMemberController {

    private final ServerMemberService memberService;

    @GetMapping
    public ResponseEntity<Page<ServerMemberDto>> findAllByServer(@PathVariable Long serverId,
                                                                 @PageableDefault(size = 30) Pageable pageable) {
        return ResponseEntity
                .ok(memberService.findAllByServer(serverId, pageable));
    }

    @PostMapping
    public ResponseEntity<Void> addMember(@PathVariable Long serverId, @RequestBody @Valid ServerMemberDto memberDto) {
        memberService.addMember(serverId, memberDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<Void> removeMember(@PathVariable Long memberId) {
        memberService.removeMember(memberId);
        return ResponseEntity.ok().build();
    }

}
