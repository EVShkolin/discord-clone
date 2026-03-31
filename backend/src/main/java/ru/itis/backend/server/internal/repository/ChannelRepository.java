package ru.itis.backend.server.internal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.itis.backend.server.internal.model.Channel;

import java.util.List;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, Long> {

    List<Channel> findAllByServerId(Long serverId);

    @Transactional
    @Modifying
    @Query("UPDATE Channel c SET c.deletedAt = CURRENT TIMESTAMP WHERE c.id = :id")
    void softDelete(Long id);

}
