package ru.itis.backend.server.api.event;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ServerUpdatedEvent(Long id, String name, String description, String iconUrl) {

    @JsonProperty("type")
    public ServerEventType getType() {
        return ServerEventType.SERVER_UPDATED;
    }

}
