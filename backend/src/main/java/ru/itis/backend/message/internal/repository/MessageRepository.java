package ru.itis.backend.message.internal.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.itis.backend.message.internal.model.Message;

import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

    Page<Message> findAllByChannelIdOrderByCreatedAtDesc(Long channelId, Pageable pageable);

    @Transactional
    @Modifying
    @Query("UPDATE Message m SET m.deletedAt = CURRENT TIMESTAMP WHERE m.id = :id")
    void softDelete(UUID id);

}
