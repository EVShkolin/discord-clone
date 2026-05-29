package ru.itis.backend.server.internal.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.itis.backend.server.api.dto.ServerDto;
import ru.itis.backend.server.api.service.ServerService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/servers")
@RequiredArgsConstructor
public class ServerController {

    private final ServerService serverService;

    @GetMapping
    public ResponseEntity<List<ServerDto>> findAllByUserId(@RequestParam("userId") Long userId) {
        return ResponseEntity.ok(serverService.findAllByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServerDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(serverService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ServerDto> create(@RequestBody @Valid ServerDto serverDto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(serverService.create(serverDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServerDto> update(@PathVariable Long id, @RequestBody @Valid ServerDto serverDto) {
        return ResponseEntity.ok(serverService.update(id, serverDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        serverService.softDelete(id);
        return ResponseEntity.noContent().build();
    }

}
