package ru.itis.backend.message.internal.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.itis.backend.message.api.MessageDto;
import ru.itis.backend.message.api.MessageService;
import ru.itis.backend.message.api.MessageUpdateDto;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/messages")
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<Page<MessageDto>> findAllByChannel(@RequestParam Long channelId,
                                                             @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(messageService.findAllByChannel(channelId, pageable));
    }

    @PostMapping
    public ResponseEntity<MessageDto> save(@Valid @RequestBody MessageDto message) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(messageService.save(message));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<MessageDto> updateText(@PathVariable UUID id, @Valid @RequestBody MessageUpdateDto messageDto) {
        return ResponseEntity.ok(messageService.updateText(id, messageDto.content()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDelete(@PathVariable UUID id) {
        messageService.softDelete(id);
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }

}
