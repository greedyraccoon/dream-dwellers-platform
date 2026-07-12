package com.greedyraccoon.backend.service;

import com.greedyraccoon.backend.dto.DealRequest;
import com.greedyraccoon.backend.dto.DealResponse;
import com.greedyraccoon.backend.model.*;
import com.greedyraccoon.backend.repository.*;
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