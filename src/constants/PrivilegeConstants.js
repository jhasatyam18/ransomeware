export const DefaultPrivilegeList = {
  Node: {
    Create: "node.create",
    Edit: "node.edit",
    Delete: "node.delete",
    List: "node.list",
    Status: "node.status",
  },
  Site: {
    Create: "site.create",
    Edit: "site.edit",
    Delete: "site.delete",
    List: "site.list",
  },
  ProtectionPlan: {
    Create: "protectionplan.create",
    Edit: "protectionplan.edit",
    Delete: "protectionplan.delete",
    List: "protectionplan.list",
    Status: "protectionplan.status",
  },
  Recovery: {
    Test: "recovery.test",
    Full: "recovery.full",
    Migration: "recovery.migration",
    Reverse: "recovery.reverse",
  },
  Jobs: {
    Replication: "jobs.replication",
    Recovery: "jobs.recovery",
  },
  Events: {
    List: "events.list",
  },
  Alerts: {
    Actions: "alerts.actions",
    Acknowledge: "alerts.acknowledge",
    List: "alerts.list",
  },
  Report: {
    Create: "report.create",
    List: "report.list",
  },
  License: {
    Create: "license.create",
    Delete: "license.delete",
    Activate: "license.activate",
    Deactivate: "license.deactivate",
    List: "license.list",
  },
  Email: {
    Configure: "email.config",
    Delete: "email.delete",
    List: "email.list",
  },
  Recipient: {
    Add: "recipient.add",
    Delete: "recipient.delete",
    Edit: "recipient.edit",
    List: "recipient.list",
  },
  Throttling: {
    Configure: "throttling.Config",
    List: "throttling.list",
  },
  Support: {
    Create: "support.create",
    Delete: "support.delete",
    List: "support.list",
  },
  User: {
    Add: "user.create",
    Edit: "user.edit",
    Delete: "user.delete",
    List: "user.list",
  }
};
