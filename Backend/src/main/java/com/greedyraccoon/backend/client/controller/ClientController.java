package com.greedyraccoon.backend.client.controller;

import com.greedyraccoon.backend.client.dto.ClientRequest;
import com.greedyraccoon.backend.client.dto.ClientResponse;
import com.greedyraccoon.backend.client.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
public class ClientController {
    private final ClientService clientService;

    @PostMapping
    public ResponseEntity<ClientResponse> createClient(@RequestBody ClientRequest request, Principal principal) {
        return ResponseEntity.ok(clientService.createClient(request, principal.getName()));
    }

    @GetMapping
    public ResponseEntity<List<ClientResponse>> getMyClients(Principal principal) {
        return ResponseEntity.ok(clientService.getClientsForAgent(principal.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientResponse> updateClient(@PathVariable Long id, @RequestBody ClientRequest request) {
        return ResponseEntity.ok(clientService.updateClient(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}
