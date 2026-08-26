package com.finintel.gateway.service;

import com.finintel.gateway.model.AuditLog;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class AuditLoggingServiceTest {

    private AuditLoggingService auditLoggingService;

    @BeforeEach
    public void setUp() {
        auditLoggingService = new AuditLoggingService();
    }

    @Test
    public void testInitialAuditLogsPresent() {
        List<AuditLog> logs = auditLoggingService.getAllAuditLogs();
        assertNotNull(logs);
        assertTrue(logs.size() >= 3, "Service should initialize with baseline audit records");
    }

    @Test
    public void testLogNewAction() {
        AuditLog newLog = auditLoggingService.logAction(
                "COMPLIANCE_OFFICER",
                "/api/v1/query",
                "What is the credit risk threshold?",
                45L,
                "SUCCESS"
        );

        assertNotNull(newLog.getId());
        assertTrue(newLog.getId().startsWith("AUD-"));
        assertEquals("COMPLIANCE_OFFICER", newLog.getUserRole());
        assertEquals(45L, newLog.getLatencyMs());
        assertEquals("SUCCESS", newLog.getStatus());

        List<AuditLog> allLogs = auditLoggingService.getAllAuditLogs();
        assertEquals(newLog.getId(), allLogs.get(0).getId(), "Most recent log should be first in list");
    }
}
