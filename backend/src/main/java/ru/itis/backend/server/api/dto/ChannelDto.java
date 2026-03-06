package ru.itis.backend.server.api.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import ru.itis.backend.server.internal.model.ChannelType;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChannelDto {

    private Long id;

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotNull
    private Long serverId;

    @NotNull
    private ChannelType type;

    @NotNull
    @Min(0)
    @Max(99)
    private Integer userLimit;

}
