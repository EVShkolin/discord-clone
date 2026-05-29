package ru.itis.backend.server.internal.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import ru.itis.backend.server.api.dto.ChannelDto;
import ru.itis.backend.server.api.service.ChannelService;

@RestController
@RequestMapping("/api/v1/servers/{serverId}/channels")
@RequiredArgsConstructor
public class ChannelController {

    private final ChannelService channelService;

    @GetMapping("/{channelId}")
    public ResponseEntity<ChannelDto> findById(@PathVariable Long serverId, @PathVariable Long channelId) {
        return ResponseEntity.ok(channelService.findById(channelId));
    }

    @PostMapping
    public ResponseEntity<ChannelDto> create(@PathVariable Long serverId, @RequestBody @Valid ChannelDto channelDto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(channelService.create(serverId, channelDto));
    }

    @PutMapping("/{channelId}")
    public ResponseEntity<ChannelDto> update(@PathVariable Long channelId,
                                             @RequestBody @Valid ChannelDto channelDto) {
        return ResponseEntity.ok(channelService.update(channelId, channelDto));
    }

    @DeleteMapping("/{channelId}")
    public ResponseEntity<Void> softDelete(@PathVariable Long channelId) {
        channelService.softDelete(channelId);
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }

}
