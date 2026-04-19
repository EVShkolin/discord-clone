package ru.itis.backend.message.api.event;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

public record MessageDeletedEvent(Long serverId, Long channelId, UUID messageId) {

    @JsonProperty
    public MessageEventType getType() {
        return MessageEventType.MESSAGE_DELETED;
    }

}
