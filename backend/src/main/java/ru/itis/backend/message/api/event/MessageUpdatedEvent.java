package ru.itis.backend.message.api.event;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.itis.backend.message.api.MessageDto;

public record MessageUpdatedEvent(MessageDto message, Long serverId) {

    @JsonProperty
    public MessageEventType getType() {
        return MessageEventType.MESSAGE_UPDATED;
    }

}
