package com.finintel.gateway.service;

import com.finintel.gateway.model.AuditLog;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class AuditLoggingService {

    private final List<AuditLog> auditLogs = Collections.synchronizedList(new ArrayList<>());

    public AuditLoggingService() {
        // Initial audit records
        logAction("SYSTEM_ADMIN", "/api/v1/ingest", "Preloaded Q3 Financial Reports into FAISS Vector Store", 145L, "SUCCESS");
        logAction("FINANCIAL_ANALYST", "/api/v1/query", "Query: What is the operating margin and revenue for Q3?", 82L, "SUCCESS");
        logAction("COMPLIANCE_OFFICER", "/api/v1/query", "Query: What are the dual authorization rules for refunds?", 64L, "SUCCESS");
    }

    public AuditLog logAction(String userRole, String endpoint, String query, Long latencyMs, String status) {
        String id = "AUD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        AuditLog log = new AuditLog(id, timestamp, userRole, endpoint, query, latencyMs, status);
        auditLogs.add(0, log);
        return log;
    }

    public List<AuditLog> getAllAuditLogs() {
        return new ArrayList<>(auditLogs);
    }
}
