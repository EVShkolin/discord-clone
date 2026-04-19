package ru.itis.backend.server.internal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.itis.backend.server.internal.model.Server;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServerRepository extends JpaRepository<Server, Long> {

    @Transactional
    @Modifying
    @Query("UPDATE Server s SET s.deletedAt = CURRENT TIMESTAMP WHERE s.id = :id")
    void softDelete(Long id);

    @Query("SELECT DISTINCT s FROM Server s JOIN s.members sm LEFT JOIN FETCH s.channels c WHERE sm.userId = :userId")
    List<Server> findAllByUserId(Long userId);

    Optional<Server> findByChannelsId(Long channelId);

}
