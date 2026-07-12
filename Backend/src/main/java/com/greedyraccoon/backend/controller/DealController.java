package com.greedyraccoon.backend.controller;

import com.greedyraccoon.backend.dto.DealRequest;
import com.greedyraccoon.backend.dto.DealResponse;
import com.greedyraccoon.backend.service.DealService;
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
}