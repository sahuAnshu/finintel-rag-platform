package com.finintel.gateway.controller;

import com.finintel.gateway.service.AuditLoggingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/gateway")
@CrossOrigin(origins = "*")
public class GatewayController {

    private final AuditLoggingService auditLoggingService;

    public GatewayController(AuditLoggingService auditLoggingService) {
        this.auditLoggingService = auditLoggingService;
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getGatewayStatus() {
        return ResponseEntity.ok(Map.of(
                "gatewayService", "FinIntel Spring Boot 3.x Enterprise Gateway",
                "status", "ACTIVE",
                "ragServiceTarget", "http://localhost:8000/api/v1",
                "securityPolicy", "OAuth2 / RBAC Interceptor Enabled",
                "uptime", "99.99%"
        ));
    }

    @PostMapping("/audit/log")
    public ResponseEntity<Map<String, Object>> createAuditLog(@RequestBody Map<String, Object> body) {
        String role = (String) body.getOrDefault("userRole", "ANALYST");
        String endpoint = (String) body.getOrDefault("endpoint", "/api/v1/query");
        String query = (String) body.getOrDefault("query", "");
        Long latency = Long.valueOf(body.getOrDefault("latencyMs", 50).toString());
        String status = (String) body.getOrDefault("status", "SUCCESS");

        auditLoggingService.logAction(role, endpoint, query, latency, status);
        return ResponseEntity.ok(Map.of("success", true, "message", "Audit trail record created"));
    }
}
