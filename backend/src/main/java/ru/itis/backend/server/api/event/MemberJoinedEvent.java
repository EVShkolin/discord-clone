package ru.itis.backend.server.api.event;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.itis.backend.server.api.dto.ServerMemberDto;

public record MemberJoinedEvent(ServerMemberDto member, Long serverId) {

    @JsonProperty("type")
    public ServerEventType getType() {
        return ServerEventType.MEMBER_JOINED;
    }

}
