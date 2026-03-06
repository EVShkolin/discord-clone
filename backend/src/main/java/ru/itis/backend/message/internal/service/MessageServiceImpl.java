package ru.itis.backend.message.internal.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.itis.backend.message.api.MessageDto;
import ru.itis.backend.message.api.MessageService;
import ru.itis.backend.message.internal.repository.MessageRepository;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;

    @Override
    public Page<MessageDto> findAllByChannel(Long channelId, Pageable pageable) {

        return null;
    }

    @Override
    public MessageDto save(MessageDto messageDto) {
        return null;
    }

    @Override
    public MessageDto updateText(UUID id, String text) {
        return null;
    }

    @Override
    public void softDelete(UUID id) {

    }
}
