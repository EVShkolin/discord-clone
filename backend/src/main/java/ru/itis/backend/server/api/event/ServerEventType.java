package ru.itis.backend.server.api.event;

public enum ServerEventType {
    CHANNEL_CREATED,
    CHANNEL_UPDATED,
    CHANNEL_DELETED,

    MEMBER_JOINED,
    MEMBER_LEFT,

    SERVER_UPDATED
}
