package ru.itis.backend.message.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface MessageService {

    Page<MessageDto> findAllByChannel(Long channelId, Pageable pageable);

    MessageDto save(MessageDto messageDto);

    MessageDto updateText(UUID id, String text);

    void softDelete(UUID id);

}
