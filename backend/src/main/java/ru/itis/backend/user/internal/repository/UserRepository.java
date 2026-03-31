package ru.itis.backend.user.internal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.itis.backend.user.internal.model.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Modifying
    @Query("UPDATE User u SET u.deletedAt = CURRENT TIMESTAMP WHERE u.id = :id")
    void softDelete(Long userId);

}
