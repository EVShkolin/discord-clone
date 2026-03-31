package ru.itis.backend.message.internal.mapper;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import ru.itis.backend.message.api.MessageDto;
import ru.itis.backend.message.internal.model.Message;
import ru.itis.backend.user.api.UserDto;

import java.util.Map;

@Component
public class MessageMapper {

    public Message fromDto(MessageDto dto) {
        return Message.builder()
                .content(dto.getContent())
                .type(dto.getType())
                .channelId(dto.getChannelId())
                .authorId(dto.getAuthor().getId())
                .build();
    }

    public MessageDto toDto(Message message, UserDto author) {
        return new MessageDto(
                message.getId(),
                message.getType(),
                message.getContent(),
                message.getChannelId(),
                author,
                message.getCreatedAt(),
                message.getUpdatedAt()
        );
    }

    public Page<MessageDto> toPageDto(Page<Message> messages, Map<Long, UserDto> users) {
        return messages.map(m -> toDto(m, users.get(m.getAuthorId())));
    }

}
