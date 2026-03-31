package ru.itis.backend.server.api.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServerMemberDto {

    private Long id;

    @NotNull
    private Long userId;

    private String name;

    private String avatarUrl;

    @NotNull
    private Long serverId;

    private Instant memberSince;

}
