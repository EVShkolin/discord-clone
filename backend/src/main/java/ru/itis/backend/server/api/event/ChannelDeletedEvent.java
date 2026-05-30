package ru.itis.backend.server.api.event;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ChannelDeletedEvent(Long channelId, Long serverId) {

    @JsonProperty("type")
    public ServerEventType getType() {
        return ServerEventType.CHANNEL_DELETED;
    }

}
