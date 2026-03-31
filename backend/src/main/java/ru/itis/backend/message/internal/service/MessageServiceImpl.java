package ru.itis.backend.message.internal.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import ru.itis.backend.common.exception.ObjectNotFoundException;
import ru.itis.backend.message.api.MessageDto;
import ru.itis.backend.message.api.MessageService;
import ru.itis.backend.message.internal.exception.EmptyTextMessageException;
import ru.itis.backend.message.internal.mapper.MessageMapper;
import ru.itis.backend.message.internal.model.Message;
import ru.itis.backend.message.internal.model.MessageType;
import ru.itis.backend.message.internal.repository.MessageRepository;
import ru.itis.backend.user.api.UserDto;
import ru.itis.backend.user.api.UserService;

import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;

    private final MessageMapper mapper;

    private final UserService userService;

    @Override
    public Page<MessageDto> findAllByChannel(Long channelId, Pageable pageable) {
        log.debug("IN MessageServiceImpl find all by channel {}, page number {}", channelId, pageable.getPageNumber());
        Page<Message> messages = messageRepository.findAllByChannelIdOrderByCreatedAtDesc(channelId, pageable);
        Map<Long, UserDto> users = userService.findAllByIds(
                messages.stream()
                        .map(Message::getAuthorId)
                        .toList()
        );

        return mapper.toPageDto(messages, users);
    }

    @Override
    public MessageDto save(MessageDto messageDto) {
        log.debug("IN MessageServiceImpl save {}", messageDto.getContent());
        if (messageDto.getType() == MessageType.TEXT && !StringUtils.hasText(messageDto.getContent()))
            throw new EmptyTextMessageException();

        Long authorId = ((Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getClaim("userId");
        messageDto.setAuthor(UserDto.builder().id(authorId).build());

        Message message = mapper.fromDto(messageDto);
        message = messageRepository.save(message);
        UserDto author = userService.findById(message.getAuthorId());
        return mapper.toDto(message, author);
    }

    @Override
    public MessageDto updateText(UUID id, String text) {
        log.debug("IN MessageServiceImpl update message {}", id);
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Message", id));
        message.setContent(text);
        message = messageRepository.save(message);

        UserDto userDto = userService.findById(message.getAuthorId());
        return mapper.toDto(message, userDto);

    }

    @Override
    public void softDelete(UUID id) {
        log.debug("IN MessageServiceImpl soft delete {}", id);
        messageRepository.softDelete(id);
    }
}
