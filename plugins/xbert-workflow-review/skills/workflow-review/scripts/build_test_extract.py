"""
Build a small synthetic extract that hits the major analysis paths:
  - one base-process group with 3 templates differing only by budget
  - one base-process group with 2 templates differing only by role
  - one over-budgeted template with enough volume to surface
  - one zombie schedule (notifications fire, zero completions)
  - one orphaned schedule (assigned to inactive user)
  - duplicate template name with whitespace collision
  - one client with no workflow configured (placeholder row)
  - per-user time concentrated on one user

Run: python build_test_extract.py > test_extract.json
"""

import json
import datetime as dt

now = dt.datetime(2026, 5, 15, tzinfo=dt.timezone.utc)
recent = (now - dt.timedelta(days=5)).isoformat()
old = (now - dt.timedelta(days=400)).isoformat()


def row(**overrides):
    base = {
        "CustomerName": "Acme Bookkeeping",
        "ClientTenantId": "client_1",
        "ClientName": "Client 1",
        "ClientCode": "C001",
        "ClientCountry": "AU",
        "AccountingType": "Xero",
        "IsLocked": False,
        "IsMarkedForDeletion": False,
        "TemplateProcessName": "Bank Reconciliation",
        "TemplateProcessOrder": 1,
        "BaseProcessTagId": "bp_recon",
        "ProcessIsDefaultBillable": True,
        "ProcessXpmTaskUuid": None,
        "TemplateId": "tpl_1",
        "TemplateName": "Bank Reconciliation",
        "TemplateIsPriority": False,
        "TemplateSubTasks": json.dumps([{"name": "match transactions"}]),
        "TemplateEstimatedTimeMinutes": 30,
        "TemplateCreationTime": old,
        "TemplateLastModifiedTime": recent,
        "TemplateCreatedByUserName": "alice@firm.com",
        "TemplateInitialStatusName": "Not Started",
        "ClientNoteLinkingTagName": None,
        "ScheduleId": "sch_1",
        "ScheduleName": "Bank Recon — weekly",
        "ScheduleIsActive": True,
        "ScheduleStartDate": old,
        "SchedulePeriod": "Week",
        "SchedulePeriodValue": 1,
        "ScheduleEndType": "Never",
        "ScheduleEndDateValue": None,
        "ScheduleEndRepeatValue": None,
        "ScheduleFutureRecurringWeeks": None,
        "ScheduleDueDatePeriod": "Day",
        "ScheduleDueDateType": "After",
        "ScheduleDueDateValue": 3,
        "ScheduleNextRecurringTime": (now + dt.timedelta(days=2)).isoformat(),
        "ScheduleLastRecurredTime": recent,
        "ScheduleCreationTime": old,
        "ScheduleLastModifiedTime": old,
        "ScheduleAssignedUserName": "alice@firm.com",
        "ScheduleAssignedUserEmail": "alice@firm.com",
        "ScheduleAssignedUserIsActive": True,
        "ScheduleAssignedRoleName": None,
        "ScheduleAssignedRoleType": None,
        "ScheduleClientLinkedTime": old,
        "ScheduleEstimatedTimeOverrideMinutes": None,
        "EffectiveEstimatedTimeMinutes": 30,
        "HasScheduleOverride": False,
        "NotificationsCreatedAllTime": 100,
        "NotificationsCreatedLast3Months": 12,
        "NotificationsCreatedLast12Months": 52,
        "NotificationsCompletedAllTime": 95,
        "LastNotificationCreatedTime": recent,
        "LastNotificationCompletedTime": recent,
        "AvgInstanceEstimatedTimeMinutes": 30,
        "AvgInstanceActualTimeMinutes": 30,
        "NotificationsCancelledAllTime": 2,
        "NotificationsSnoozedAllTime": 2,
        "NotificationsDismissedAllTime": 1,
        "NotificationsCancelledLast12Months": 1,
        "NotificationsSnoozedLast12Months": 1,
        "NotificationsDismissedLast12Months": 0,
        "PerUserTimeJson": json.dumps({"alice@firm.com": 600.0}),
        "TopUserLoadFraction": 1.0,
        "ZeroLoadAssignedUserCount": 0,
    }
    base.update(overrides)
    return base


rows = [
    # ---- Base-process group with 3 budget-variant templates ----
    row(
        TemplateId="tpl_recon_low",
        TemplateName="Bank Reconciliation (Low)",
        TemplateEstimatedTimeMinutes=30,
        EffectiveEstimatedTimeMinutes=30,
        ScheduleId="sch_recon_low",
        ScheduleName="Recon Low — weekly",
    ),
    row(
        TemplateId="tpl_recon_med",
        TemplateName="Bank Reconciliation (Medium)",
        TemplateEstimatedTimeMinutes=60,
        EffectiveEstimatedTimeMinutes=60,
        ScheduleId="sch_recon_med",
        ScheduleName="Recon Medium — weekly",
        AvgInstanceActualTimeMinutes=60,
    ),
    row(
        TemplateId="tpl_recon_high",
        TemplateName="Bank Reconciliation (High)",
        TemplateEstimatedTimeMinutes=120,
        EffectiveEstimatedTimeMinutes=120,
        ScheduleId="sch_recon_high",
        ScheduleName="Recon High — weekly",
        AvgInstanceActualTimeMinutes=120,
    ),
    # ---- Base-process group with 2 role-variant templates ----
    row(
        TemplateProcessName="Payroll Review",
        BaseProcessTagId="bp_payroll",
        TemplateId="tpl_payroll_jr",
        TemplateName="Payroll Review (Junior)",
        TemplateEstimatedTimeMinutes=45,
        EffectiveEstimatedTimeMinutes=45,
        ScheduleId="sch_payroll_jr",
        ScheduleName="Payroll Jr",
        ScheduleAssignedUserName=None,
        ScheduleAssignedUserEmail=None,
        ScheduleAssignedUserIsActive=None,
        ScheduleAssignedRoleName="Junior",
        ScheduleAssignedRoleType="Internal",
        AvgInstanceActualTimeMinutes=45,
    ),
    row(
        TemplateProcessName="Payroll Review",
        BaseProcessTagId="bp_payroll",
        TemplateId="tpl_payroll_sr",
        TemplateName="Payroll Review (Senior)",
        TemplateEstimatedTimeMinutes=45,
        EffectiveEstimatedTimeMinutes=45,
        ScheduleId="sch_payroll_sr",
        ScheduleName="Payroll Sr",
        ScheduleAssignedUserName=None,
        ScheduleAssignedUserEmail=None,
        ScheduleAssignedUserIsActive=None,
        ScheduleAssignedRoleName="Senior",
        ScheduleAssignedRoleType="Internal",
        AvgInstanceActualTimeMinutes=45,
    ),
    # ---- Over-budgeted template (high impact) ----
    row(
        TemplateProcessName="GST Return",
        BaseProcessTagId="bp_gst",
        TemplateId="tpl_gst",
        TemplateName="GST Return",
        TemplateEstimatedTimeMinutes=240,
        EffectiveEstimatedTimeMinutes=240,
        AvgInstanceActualTimeMinutes=60,  # massively over-budgeted
        ScheduleId="sch_gst",
        ScheduleName="GST monthly",
        SchedulePeriod="Month",
        SchedulePeriodValue=1,
        NotificationsCreatedAllTime=24,
        NotificationsCreatedLast12Months=12,
        NotificationsCompletedAllTime=24,
    ),
    # ---- Zombie schedule (fires but zero completions) ----
    row(
        TemplateProcessName="Year-end Review",
        BaseProcessTagId="bp_yer",
        TemplateId="tpl_yer",
        TemplateName="Year-end Review",
        ScheduleId="sch_yer_zombie",
        ScheduleName="YER zombie",
        NotificationsCreatedAllTime=15,
        NotificationsCreatedLast3Months=5,
        NotificationsCreatedLast12Months=15,
        NotificationsCompletedAllTime=0,
        LastNotificationCompletedTime=None,
        AvgInstanceActualTimeMinutes=0,
    ),
    # ---- Orphaned schedule (inactive user) ----
    row(
        TemplateProcessName="BAS Lodgement",
        BaseProcessTagId="bp_bas",
        TemplateId="tpl_bas",
        TemplateName="BAS Lodgement",
        ScheduleId="sch_bas_orphan",
        ScheduleName="BAS orphan",
        ScheduleAssignedUserName="bob_left@firm.com",
        ScheduleAssignedUserEmail="bob_left@firm.com",
        ScheduleAssignedUserIsActive=False,
    ),
    # ---- Duplicate template name with whitespace collision ----
    row(
        TemplateProcessName="Custom Task",
        BaseProcessTagId="bp_custom",
        TemplateId="tpl_dup_a",
        TemplateName="Custom Task ",  # trailing space
        ScheduleId="sch_dup_a",
        ScheduleName="Custom Task A",
    ),
    row(
        TemplateProcessName="Custom Task",
        BaseProcessTagId="bp_custom2",
        TemplateId="tpl_dup_b",
        TemplateName="Custom Task",
        ScheduleId="sch_dup_b",
        ScheduleName="Custom Task B",
    ),
    # ---- Client with no workflow configured (placeholder row) ----
    {
        "CustomerName": "Acme Bookkeeping",
        "ClientTenantId": "client_no_workflow",
        "ClientName": "Empty Client",
        "ClientCode": "C002",
        "ClientCountry": "AU",
        "AccountingType": "Xero",
        "IsLocked": False,
        "IsMarkedForDeletion": False,
        "TemplateId": None,
        "ScheduleId": None,
        "TemplateName": None,
        "ScheduleName": None,
    },
]

print(json.dumps(rows, indent=2, default=str))
