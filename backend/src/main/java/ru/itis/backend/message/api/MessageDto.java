package ru.itis.backend.message.api;

import ru.itis.backend.message.internal.model.MessageType;

import java.time.Instant;
import java.util.UUID;

public class MessageDto {

    private UUID id;

    private MessageType type;

    private Long channelId;

    private Object authorDto;

    private Instant createdAt;
}
