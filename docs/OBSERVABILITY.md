# Observability & Instrumentation Guide

## Purpose

This document provides the detailed implementation guidance for observability supporting the SLA: metrics, logs, tracing, dashboards, alert rules, exporters, retention, and runbooks. It's written for an on-premise, internal deployment while remaining cloud-ready (configurable exporters, managed services, and scalable storage).

Audience: DevOps, Platform Engineers, Backend Developers, Support.

## Overview & Strategy

- Telemetry types: Metrics (time-series), Logs (structured), Traces (distributed), Events (alerts/incidents).
- Primary goals: detect and alert on SLA breaches, provide actionable diagnostics for incidents, enable postmortems and capacity planning.
- Keep cardinality low on high-volume labels. Use labels for service, endpoint, environment, and critical dimensions only.

## Architectural Components (recommended)

- Metrics: Prometheus (on-prem) or managed Prometheus (cloud). Use a Prometheus-compatible metrics endpoint (Prometheus client libs).
- Traces: OpenTelemetry (OTel) collector -> Jaeger/Tempo or vendor (Honeycomb, LightStep).
- Logs: structured JSON logs shipped to centralized store (Loki, ELK stack, or a cloud logging service).
- Alerting: Alertmanager (Prometheus) or PagerDuty integration. Grafana Alerting is an option.
- Visualization: Grafana dashboards for SLA, auth, payroll, queue, DB.
- Correlation: propagate request_id / trace_id across services and include in logs and metrics.

## Instrumentation Guidelines

1) Metrics
- Use client libraries: prometheus_client for Python, prom-client for Node, promphp/prometheus_client for PHP or the Laravel Prometheus exporter.
- Metric types and naming conventions (Prometheus style):
  - app_requests_total (counter) {method, endpoint, status}
  - app_request_duration_seconds_bucket (histogram) {endpoint}
  - auth_login_success_total (counter)
  - auth_login_failure_total (counter)
  - payroll_run_duration_seconds (histogram)
  - payroll_run_errors_total (counter)
  - queue_jobs_pending (gauge) {queue}
  - db_connections (gauge)
  - worker_process_count (gauge)

- Labels: service, env, endpoint (or route), method, status, team (optional).
- Avoid high-cardinality labels like user_id on metrics; prefer logs/traces for user-level debugging.

2) Logging
- Structured JSON logs are required. Fields:
  - timestamp, level, service, env, request_id, trace_id, user_id (nullable), employee_id (nullable), route/endpoint, message, extra
- Redaction: Do NOT log PII (full SSNs, TINs, passwords). Use hashes or masked values if needed.
- Sample format (JSON):
  {
    "ts":"2025-10-24T09:00:00Z",
    "level":"error",
    "service":"cameco-api",
    "env":"prod",
    "request_id":"req-...",
    "trace_id":"...",
    "user_id":123,
    "employee_id":456,
    "message":"Payroll calculation failed",
    "error":"Divide by zero",
    "context":{...}
  }

3) Tracing
- Use OpenTelemetry SDK in app services. Instrument key flows: login, dashboard rendering, payroll run, long-running worker jobs.
- Span structure: root span per request, child spans for DB queries, external API calls, long-running tasks.
- Include important attributes: user.id, employee.id, job.id, payroll_period.id.
- Exporter: OTLP to an OTel Collector; the collector forwards to Jaeger/Tempo or vendor.

4) Correlation
- Generate `request_id` at the HTTP ingress (load balancer or app) and propagate via headers (X-Request-ID). Ensure request_id and trace_id are present in logs and metrics labels where appropriate.

## Dashboards & Key Views

Create the following Grafana dashboards (examples):
- System Overview: uptime, p95/p99 latency, error rate, active users, queue backlog.
- Auth Health: login attempts, success/failure rates, latency of /login endpoint.
- Payroll Operations: payroll run durations, failures, last run status, queued payroll jobs.
- Worker & Queue Health: queue size, consumer lag, failed jobs, worker restarts.
- Database: connections, slow queries, replication lag (if applicable), long-running transactions.
- Infrastructure: CPU, memory, disk, network I/O per host.

Each dashboard should include a time-range selector and annotations for deploys and maintenance windows.

## Alert Rules (examples)

Use Prometheus alerting rules (Alertmanager) or Grafana Alerting. Example PromQL rules:

- App down (synthetic):
  - expr: probe_success{job="blackbox", probe="login"} == 0
  - for: 2m
  - severity: critical

- High error rate:
  - expr: (sum(increase(app_requests_total{job="api",status=~"5.."}[5m])) / sum(increase(app_requests_total{job="api"}[5m]))) > 0.01
  - for: 5m
  - severity: high

- Queue backlog:
  - expr: queue_jobs_pending{queue="default"} > 1000
  - for: 10m
  - severity: high

- DB connections saturation:
  - expr: db_connections / db_max_connections > 0.8
  - for: 5m
  - severity: high

Define silence windows for maintenance and rate-limit noisy alerts (use Alertmanager routing).

## Retention & Storage Recommendations

- Metrics: Prometheus local storage with Thanos/remote_write for long-term retention, or use remote write to Cortex/Managed services. Retention policy: 14d raw, 90d rolled-up.
- Logs: 90 days in Loki/ELK; longer for payroll-related audit logs (2 years or as required by compliance) moved to object storage (S3) with lifecycle policies.
- Traces: 30 days by default; adjust based on storage costs and compliance needs.

## On-Premise vs Cloud Guidance

- On-premise:
  - Deploy Prometheus + Alertmanager + Grafana on-cluster/VMs.
  - Use OTel Collector to aggregate traces and forward to local Jaeger or hosted vendor.
  - Use centralized logging (ELK/Loki) with persistent storage and retention policies on SAN/NFS/object storage.

- Cloud-ready:
  - Swap in managed services: Amazon Managed Prometheus, Grafana Cloud, Sentry, Datadog, or New Relic.
  - Use remote_write from Prometheus to cloud storage or managed ingest.
  - OTel Collector can forward to cloud vendors via OTLP.

## Security & Access

- Restrict access to dashboards and alerting channels to authorized roles (Superadmin, Admin, Ops).
- Use RBAC in Grafana and SSO where available.
- Protect telemetry endpoints and the OTLP collector with mTLS or API keys in production.

## Runbooks & Playbooks (linking)

- Maintain short runbooks per incident type (app down, DB outage, payroll failure, queue spike). Place them in a repository or the docs/ folder and link from alerts/incident records.
- Runbook should include: detection steps, quick mitigation steps, communication templates, escalation contacts, postmortem checklist.

## Example PromQL snippets

- p95 request latency for login endpoint:
  - histogram_quantile(0.95, sum(rate(app_request_duration_seconds_bucket{endpoint="/login"}[5m])) by (le))

- error rate over 5m:
  - sum(increase(app_requests_total{status=~"5.."}[5m])) / sum(increase(app_requests_total[5m]))

## Integration with DB tables (optional)

- For on-prem audits and incident recording the project also includes monitoring tables in `docs/DATABASE_SCHEMA.md` (e.g. `monitoring_checks`, `alerts`, `incident_reports`). These can be used to record synthesized check results and incidents from internal tooling.

## Operational runbook skeleton

1. Alert received -> Acknowledge in PagerDuty/Alertmanager.
2. Triage: collect logs (last 1h), traces, metric snapshots, recent deploys.
3. Mitigate: scale workers, enable maintenance mode, failover DB if necessary.
4. Resolve: fix/rollback and deploy, verify with synthetic checks.
5. Postmortem: create incident report in `incident_reports` table and produce postmortem document.

## Appendices

- Sample Grafana panel queries and example dashboard JSONs should be stored under `docs/observability/dashboards/` for reuse.
- Include example exporter configurations (Prometheus scrape configs, Loki push, OTel collector config) in `infrastructure/` if you want me to scaffold them.

---

If you'd like, I can scaffold Prometheus + Grafana example configs, an OTel collector YAML, and a sample Grafana dashboard JSON next.
