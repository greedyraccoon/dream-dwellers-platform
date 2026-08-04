package com.greedyraccoon.backend.client.service;

import com.greedyraccoon.backend.client.dto.ClientRequest;
import com.greedyraccoon.backend.client.dto.ClientResponse;
import com.greedyraccoon.backend.client.model.Client;
import com.greedyraccoon.backend.client.repository.ClientRepository;
import com.greedyraccoon.backend.user.model.User;
import com.greedyraccoon.backend.user.repository.UserRepository;
import com.greedyraccoon.backend.exceptionHandler.ResourceNotFoundException;
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
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));

        // Only return clients assigned to this specific agent
        return clientRepository.findByAgentId(agent.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ClientResponse updateClient(Long id, ClientRequest request) {
        Client existing = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));

        // Update fields
        existing.setName(request.name());
        existing.setEmail(request.email());
        existing.setPhone(request.phone());
        existing.setBudget(request.budget());
        existing.setPreferences(request.preferences());

        Client saved = clientRepository.save(existing);
        return mapToResponse(saved);
    }

    public void deleteClient(Long id) {
        Client existing = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));

        clientRepository.deleteById(existing.getId());
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