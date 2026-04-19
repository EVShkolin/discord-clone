package ru.itis.backend.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import ru.itis.backend.message.api.event.MessageCreatedEvent;
import ru.itis.backend.message.api.event.MessageDeletedEvent;
import ru.itis.backend.message.api.event.MessageUpdatedEvent;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebsocketEventHandler {

    private final SimpMessagingTemplate template;

    @EventListener
    void on(MessageCreatedEvent event) {
        log.debug("New message create event, messageId: {}", event.message().getId());
        template.convertAndSend("/topic/server/" + event.serverId(), event);
    }

    @EventListener
    void on(MessageUpdatedEvent event) {
        log.debug("New message update event, messageId: {}", event.message().getId());
        template.convertAndSend("/topic/server/" + event.serverId(), event);
    }

    @EventListener
    void on(MessageDeletedEvent event) {
        log.debug("New message delete event, messageId: {}", event.messageId());
        template.convertAndSend("/topic/server/" + event.serverId(), event);
    }

}

