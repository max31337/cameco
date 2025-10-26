# Service Level Agreement (SLA) & System Monitoring

## Purpose

This document describes the Service Level Agreement (SLA) expectations for the Cameco HRIS platform (SyncingSteel), the monitoring and alerting strategy, metrics to track, uptime/downtime policies, incident handling, and runbook references for Superadmin and Operations teams.

Audience: Superadmin, Admin, DevOps/Platform Engineers, Support.

## Scope

- Platform availability and reliability for the production environment.
- Monitoring, alerting, incident escalation, and post-incident review.
- Scheduled maintenance windows and change notifications.
- Metrics, dashboards, and audit/retention policy for monitoring data.

## SLA Targets

- Availability (Uptime): 99.9% measured monthly (<= 44.1 minutes downtime/month).
- Critical Incident Response Time (acknowledge): 15 minutes during business hours, 60 minutes outside business hours.
- Critical Incident Resolution Target: 4 hours (work to restore service or apply mitigations).
- High-severity Incident Response: 60 minutes and resolution target 24 hours.
- Medium/Low Severity: triaged within 4 business hours; resolved per priority and change windows.

Definitions:
- Critical: Platform-wide outages or loss of authentication, payments, payroll runs failing, data corruption.
- High: Major feature unusable for many users (e.g., timekeeping ingest failures), degraded performance affecting business processes.
- Medium: Single-feature issues affecting a subset of users.
- Low: Cosmetic or non-blocking issues.

## Monitoring & Metrics

Key monitored areas and representative metrics:

- Uptime / Availability: uptime checks for web front-end, API endpoints, scheduled cron/queue workers.
- Latency: p95/p99 response times for key endpoints (/login, /dashboard, /api/payroll/*).
- Error Rate: 5xx and increased 4xx rates per endpoint.
- Resource Utilization: CPU, memory, disk, DB connections, I/O wait on database hosts.
- Queue Health: number of pending jobs, failed jobs rate, worker counts.
- Database metrics: slow queries, replication lag (if applicable), connection saturation.
- Storage: available disk space, filesystem I/O errors, S3/remote storage errors for attachments.

Suggested metric retention and resolution:
- High-resolution (1m) metrics for 14 days; aggregated (5m/1h) for 90 days; long-term (daily) for 2 years for audit.

## Observability (brief)

We treat observability as the engineering implementation layer that enables SLA monitoring, alerting, and incident response. The SLA above lists the high-level metrics and alerts; the detailed implementation (metric names, instrumentation guidance, dashboards, alert rules, tracing, exporters, and retention) lives in the dedicated observability guide: `docs/OBSERVABILITY.md`.

Key observability priorities (short):
- Instrument request/response latency (histogram) and success/failure counters for auth (/login), dashboard, and core APIs.
- Structured JSON logging with correlation/request IDs and key user identifiers (user_id, employee_id) while respecting PII rules.
- Distributed tracing (OpenTelemetry) for long-running jobs and payroll runs, with traces correlated to logs and metrics.
- Centralized metrics (Prometheus or Prometheus-compatible storage) and dashboards (Grafana) for real-time SLA dashboards.
- Alert rules implemented in Prometheus/Grafana or alerting platform (PagerDuty) and exercised via runbooks.

For the detailed observability implementation and operational recipes, see `docs/OBSERVABILITY.md`.

## Alerts & Thresholds (examples)

- Uptime check failure (endpoint unreachable): Pager/Email/SMS to Ops immediately — Critical.
- 5xx error rate > 1% over 5 minutes on core APIs: Page Ops — High.
- Queue backlog > 1000 for 10 minutes: Alert to Ops — High.
- DB connections > 80% capacity: Alert to DB admin — High.
- Disk free space < 10% on any node: Email + Slack — High.
- CPU sustained > 85% for 10 minutes: Warning + Ops Slack channel — Medium.

Escalation:
- Alert fires -> Acknowledge within target response -> Triage -> Escalate to on-call if not resolved per SLA.
- Use structured incident states (Triggered -> Acknowledged -> Mitigating -> Resolved -> Postmortem).

## Incident Management

1. Detection: automated alert or user report.
2. Triage: determine impact, severity, and affected systems.
3. Mitigation: apply temporary fix (scaling, routing, queuing) to restore service.
4. Resolution: implement root cause fix, test, and deploy.
5. Post-Incident Review: write a postmortem, include timeline, root cause, impact, fix, and actions.

Incident owners:
- Platform/DevOps: infrastructure, monitoring, DB, network.
- Backend devs: code fixes, database migrations, hotfixes.
- Superadmin: external communication to stakeholders when appropriate.

## Maintenance & Change Windows

- Regular maintenance windows: Sundays 02:00–05:00 local timezone (default); changes outside window require stakeholder sign-off.
- Emergency patches allowed outside windows for Critical incidents.
- Notify all admins 72 hours before planned maintenance; follow-up reminder 24 hours prior and 1 hour prior.

## Reporting & Dashboards

- Provide a dashboard for SLA metrics: uptime, incidents per period, MTTR, MTTA, p95/p99 latency, error rates, queue health.
- Weekly and monthly SLA reports delivered to Superadmin and Admins.

## Notifications & Channels

- Primary: PagerDuty (or equivalent) for Critical alerts.
- Secondary: Email and Slack channel (#ops-alerts).
- Tertiary: SMS for out-of-hours critical alerts.

## Runbooks & Playbooks

Provide documented runbooks for common incidents, including:

- Lost connectivity to DB (steps: failover, scale read replicas, restore networking).
- High error rates after deploy (steps: revert deploy, enable maintenance page, scale API nodes).
- Worker queue spikes (steps: increase workers, scale queue service, purge malformed jobs).

## Data Retention & Logs

- Retain application logs and request traces for at least 90 days (longer for audited payroll actions — 2 years).
- Store critical audit logs and payroll actions for 7 years (per local compliance) if required by law — coordinate with legal.

## Responsibilities

- Superadmin: approve SLA, external communications, and major incident declarations.
- Admin: coordinate operational readiness, ensure on-call rotations and contact lists are up to date.
- DevOps/Platform: maintain monitoring, alerting, runbooks, and infrastructures.

## Integrations & Tools

- Recommended tools: Prometheus + Grafana (metrics), Loki/ELK (logs), Sentry (errors), PagerDuty (alerts), UptimeRobot/Blackbox exporter (uptime), AWS CloudWatch (if on AWS).

## Appendix: Example Alerting Matrix

| Severity | Example trigger | Acknowledge | Resolution target | Channels |
|---|---:|---:|---:|---|
| Critical | Production app down | 15 min | 4 hours | Pager, Email, Slack |
| High | DB connection saturation | 60 min | 24 hours | Email, Slack |
| Medium | Single feature failure | 4 hours | 7 days | Slack |
| Low | Cosmetic issue | 3 business days | 30 days | Ticket |

---

For any questions about SLA specifics or to request changes to targets, contact the Superadmin or Platform team.


### Monitoring & SLA (system monitoring, alerts, uptime)
```sql
-- monitoring_checks: uptime probes and synthetic checks
CREATE TABLE monitoring_checks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    check_type ENUM('http','tcp','blackbox','ping') DEFAULT 'http',
    interval_seconds INT DEFAULT 60,
    enabled BOOLEAN DEFAULT TRUE,
    last_checked_at TIMESTAMP NULL,
    last_status VARCHAR(50) NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- system_metrics: time-series aggregated metrics (store summarized rows)
CREATE TABLE system_metrics (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    metric_key VARCHAR(191) NOT NULL, -- e.g. "app.requests.p95", "db.connections"
    metric_value DOUBLE NOT NULL,
    recorded_at TIMESTAMP NOT NULL,
    tags JSON NULL,
    created_at TIMESTAMP,
    INDEX(metric_key, recorded_at)
);

-- alerts: recorded alert events and statuses
CREATE TABLE alerts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    monitoring_check_id BIGINT UNSIGNED NULL,
    alert_key VARCHAR(191) NOT NULL,
    severity ENUM('critical','high','medium','low') DEFAULT 'medium',
    message TEXT NULL,
    status ENUM('triggered','acknowledged','resolved') DEFAULT 'triggered',
    triggered_at TIMESTAMP NOT NULL,
    acknowledged_at TIMESTAMP NULL,
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- incident_reports: higher-level incidents created from alerts
CREATE TABLE incident_reports (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    severity ENUM('critical','high','medium','low') DEFAULT 'medium',
    started_at TIMESTAMP NOT NULL,
    ended_at TIMESTAMP NULL,
    status ENUM('open','mitigating','resolved') DEFAULT 'open',
    created_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- maintenance_windows: scheduled maintenance periods
CREATE TABLE maintenance_windows (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(191) NOT NULL,
    description TEXT NULL,
    starts_at TIMESTAMP NOT NULL,
    ends_at TIMESTAMP NOT NULL,
    created_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- sla_agreements: high-level SLA records and contact/emergency policies
CREATE TABLE sla_agreements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    description TEXT NULL,
    uptime_target VARCHAR(50) NULL, -- e.g. '99.9%'
    response_time_policy JSON NULL, -- e.g. {"critical":15, "high":60}
    escalation_policy JSON NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- monitoring_integrations: external integrations (PagerDuty, Sentry, Prometheus endpoints)
CREATE TABLE monitoring_integrations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    integration_type VARCHAR(100) NOT NULL,
    config JSON NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- notification_subscriptions: who/where to notify for alerts
CREATE TABLE notification_subscriptions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    target_type ENUM('user','email','slack','pager') DEFAULT 'email',
    target_identifier VARCHAR(255) NOT NULL,
    subscription_type VARCHAR(100) NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```