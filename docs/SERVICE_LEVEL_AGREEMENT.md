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
