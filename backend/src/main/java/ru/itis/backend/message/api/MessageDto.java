package ru.itis.backend.message.api;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.itis.backend.message.internal.model.MessageType;
import ru.itis.backend.user.api.UserDto;

import java.time.Instant;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MessageDto {

    private UUID id;

    @NotNull
    private MessageType type;

    private String content;

    @NotNull
    private Long channelId;

    private UserDto author;

    private Instant createdAt;

    private Instant updatedAt;

}
