package ru.itis.backend.server.internal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.itis.backend.server.internal.model.Server;

@Repository
public interface ServerRepository extends JpaRepository<Server, Long> {

    @Modifying
    @Query("UPDATE Server s SET s.deletedAt = CURRENT TIMESTAMP WHERE s.id = :id")
    void softDelete(Long id);

}
