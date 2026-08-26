package com.finintel.gateway.model;

import java.time.LocalDateTime;

public class AuditLog {
    private String id;
    private String timestamp;
    private String userRole;
    private String endpoint;
    private String query;
    private Long latencyMs;
    private String status;

    public AuditLog() {}

    public AuditLog(String id, String timestamp, String userRole, String endpoint, String query, Long latencyMs, String status) {
        this.id = id;
        this.timestamp = timestamp;
        this.userRole = userRole;
        this.endpoint = endpoint;
        this.query = query;
        this.latencyMs = latencyMs;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }

    public String getEndpoint() { return endpoint; }
    public void setEndpoint(String endpoint) { this.endpoint = endpoint; }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public Long getLatencyMs() { return latencyMs; }
    public void setLatencyMs(Long latencyMs) { this.latencyMs = latencyMs; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
