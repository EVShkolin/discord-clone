package ru.itis.backend.user.internal.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
@SQLRestriction("deleted_at IS NULL")
@Table(schema = "user_schema", name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private UserStatus status;

    @CreationTimestamp
    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

}
