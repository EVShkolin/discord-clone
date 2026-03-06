package ru.itis.backend.server.internal.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.itis.backend.server.internal.model.ServerMember;

@Repository
public interface ServerMemberRepository extends JpaRepository<ServerMember, Long> {

    Page<ServerMember> findAllByServerId(Long serverId, Pageable pageable);

}
