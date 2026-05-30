package ru.itis.backend.server.api.event;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.itis.backend.server.api.dto.ChannelDto;

public record ChannelCreatedEvent(ChannelDto channel, Long serverId) {

    @JsonProperty("type")
    public ServerEventType getType() {
        return ServerEventType.CHANNEL_CREATED;
    }

}
