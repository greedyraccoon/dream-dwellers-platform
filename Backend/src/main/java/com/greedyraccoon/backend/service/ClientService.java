package com.greedyraccoon.backend.service;

import com.greedyraccoon.backend.dto.ClientRequest;
import com.greedyraccoon.backend.dto.ClientResponse;
import com.greedyraccoon.backend.model.Client;
import com.greedyraccoon.backend.model.User;
import com.greedyraccoon.backend.repository.ClientRepository;
import com.greedyraccoon.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    public ClientResponse createClient(ClientRequest request, String agentEmail) {
        // Find the logged-in agent using the JWT email
        User agent = userRepository.findByEmail(agentEmail)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        // Map DTO to Entity
        Client client = new Client();
        client.setName(request.name());
        client.setEmail(request.email());
        client.setPhone(request.phone());
        client.setBudget(request.budget());
        client.setPreferences(request.preferences());

        // Link client to the agent
        client.setAgent(agent);

        // Save to DB
        Client savedClient = clientRepository.save(client);

        return mapToResponse(savedClient);
    }

    public List<ClientResponse> getClientsForAgent(String agentEmail) {
        User agent = userRepository.findByEmail(agentEmail)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        // Only return clients assigned to this specific agent
        return clientRepository.findByAgentId(agent.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ClientResponse mapToResponse(Client client) {
        return new ClientResponse(
                client.getId(),
                client.getName(),
                client.getEmail(),
                client.getPhone(),
                client.getBudget(),
                client.getPreferences(),
                client.getAgent().getName()
        );
    }
}