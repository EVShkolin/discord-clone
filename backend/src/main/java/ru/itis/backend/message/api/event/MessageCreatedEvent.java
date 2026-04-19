package ru.itis.backend.message.api.event;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.itis.backend.message.api.MessageDto;

public record MessageCreatedEvent(MessageDto message, Long serverId) {

    @JsonProperty("type")
    public MessageEventType getType() {
        return MessageEventType.MESSAGE_CREATED;
    }
}
