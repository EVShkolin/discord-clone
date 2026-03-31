package ru.itis.backend.server.internal.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Table(schema = "server_schema", name = "server_members")
public class ServerMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "server_id")
    private Server server;

    @Column(name = "user_id")
    private Long userId;

    @CreationTimestamp
    @Column(name = "created_at")
    private Instant createdAt;

}
