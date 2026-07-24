package com.greedyraccoon.backend.deal.service;

import com.greedyraccoon.backend.client.repository.ClientRepository;
import com.greedyraccoon.backend.deal.dto.DealRequest;
import com.greedyraccoon.backend.deal.dto.DealResponse;
import com.greedyraccoon.backend.deal.model.Deal;
import com.greedyraccoon.backend.deal.repository.DealRepository;
import com.greedyraccoon.backend.property.model.Property;
import com.greedyraccoon.backend.property.repository.PropertyRepository;
import com.greedyraccoon.backend.client.model.Client;
import com.greedyraccoon.backend.user.model.User;
import com.greedyraccoon.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DealService {
    private final DealRepository dealRepository;
    private final PropertyRepository propertyRepository;
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    public DealResponse createDeal(DealRequest request, String agentEmail) {
        User agent = userRepository.findByEmail(agentEmail).orElseThrow();
        Property property = propertyRepository.findById(request.propertyId()).orElseThrow();
        Client client = clientRepository.findById(request.clientId()).orElseThrow();

        Deal deal = new Deal();
        deal.setProperty(property);
        deal.setClient(client);
        deal.setAgent(agent);
        deal.setFinalPrice(request.finalPrice());
        deal.setStatus(Deal.DealStatus.valueOf(request.status().toUpperCase()));

        return mapToResponse(dealRepository.save(deal));
    }

    public List<DealResponse> getDealsForAgent(String agentEmail) {
        User agent = userRepository.findByEmail(agentEmail).orElseThrow();
        return dealRepository.findByAgentId(agent.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private DealResponse mapToResponse(Deal deal) {
        return new DealResponse(
                deal.getId(),
                deal.getProperty().getTitle(),
                deal.getClient().getName(),
                deal.getAgent().getName(),
                deal.getFinalPrice(),
                deal.getStatus().name()
        );
    }
}