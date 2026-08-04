package com.greedyraccoon.backend.deal.controller;

import com.greedyraccoon.backend.deal.dto.DealRequest;
import com.greedyraccoon.backend.deal.dto.DealResponse;
import com.greedyraccoon.backend.deal.service.DealService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/deals")
@RequiredArgsConstructor
public class DealController {
    private final DealService dealService;

    @PostMapping
    public ResponseEntity<DealResponse> createDeal(@RequestBody DealRequest request, Principal principal) {
        return ResponseEntity.ok(dealService.createDeal(request, principal.getName()));
    }

    @GetMapping
    public ResponseEntity<List<DealResponse>> getMyDeals(Principal principal) {
        return ResponseEntity.ok(dealService.getDealsForAgent(principal.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DealResponse> updateDeal(@PathVariable Long id, @RequestBody DealRequest request) {
        return ResponseEntity.ok(dealService.updateDeal(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeal(@PathVariable Long id) {
        dealService.deleteDeal(id);
        return ResponseEntity.noContent().build();
    }
    
}