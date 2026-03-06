package ru.itis.backend.message.internal.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.itis.backend.message.api.MessageDto;
import ru.itis.backend.message.api.MessageService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/messages")
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<Page<MessageDto>> findAllByChannel(@RequestParam Long channelId,
                                                             @PageableDefault(size = 50) Pageable pageable) {
        return null;
    }

}
