package ru.itis.backend.server.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ServerDto {

    private Long id;

    @NotBlank
    @Size(max = 50)
    private String name;

    @Size(max = 1000)
    private String description;

    private List<ChannelDto> channels = new ArrayList<>();

    private Long creatorId;

    private String iconUrl;

    private Instant createdAt;

}


