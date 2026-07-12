package com.greedyraccoon.backend.controller;

import com.greedyraccoon.backend.dto.ClientRequest;
import com.greedyraccoon.backend.dto.ClientResponse;
import com.greedyraccoon.backend.service.ClientService;
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
    public ResponseEntity<ClientResponse> createClient(
            @RequestBody ClientRequest request,
            Principal principal
    ) {
        return ResponseEntity.ok(clientService.createClient(request, principal.getName()));
    }

    @GetMapping
    public ResponseEntity<List<ClientResponse>> getMyClients(Principal principal) {
        return ResponseEntity.ok(clientService.getClientsForAgent(principal.getName()));
    }
}