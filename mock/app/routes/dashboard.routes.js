module.exports = app => {
  app.get("/api/v1/dashboard/titles", (req, res) => {
    const response = { "siteCount": 2, "protectionPlans": 2, "siteConnections": [{ "sourceID": 1, "targetID": 2 }, { "sourceID": 1, "targetID": 3 }, { "sourceID": 2, "targetID": 5 }, { "sourceID": 3, "targetID": 4 }, { "sourceID": 6, "targetID": 4 }, { "sourceID": 6, "targetID": 7 }], "siteDetails": [{ "id": 1, "name": "VMware Site" }, { "id": 2, "name": "AWS Site" }, { "id": 3, "name": "GCP Site" }, { "id": 4, "name": "AWS_Mumbai" }, { "id": 5, "name": "GCP_US" }, { "id": 6, "name": "GCP_US" }, { "id": 7, "name": "VMWARE_2" }], "protectedVMs": 2, "protectedStorage": 155 }
    res.send(response);
  });

  app.get("/api/v1/dashboard/recoverystats", (req, res) => {
    const response = {
      "testExecutions": 50,
      "fullRecovery": 10,
      "migrations": 12,
      "rto": 902
    }
    res.send(response);
  });

  app.get("/api/v1/dashboard/replicationstats", (req, res) => {
    const response = {
      "changedRate": 15820,
      "completed": 2,
      "dataReduction": 43.31524397419617,
      "failed": 0,
      "inSync": 1,
      "notInsync": 1,
      "rpo": 600,
      "running": 0
    }
    res.send(response);
  });

  app.get("/api/v1/dashboard/bandwidthusage", (req, res) => {
    const response = [
      {
        "timeStamp": 1617734041,
        "transferredSize": 4016.7656049728394
      },
      {
        "timeStamp": 1617683613,
        "transferredSize": 79115
      }
    ]
    res.send(response);
  });

  app.get("/api/v1/dashboard/protectedvms", (req, res) => {
    const response = {
      "protectedVMs": 1,
      "unprotectedVMs": 10
    }
    res.send(response);
  });

  app.get("/api/v1/dashboard/nodestats", (req, res) => {
    const response = [
      {
        "name": "Local Node",
        "deployedOn": "VMware",
        "hostname": "54.38.208.201",
        "vms": 1,
        "status": "online",
        "type": "Protection",
        "usage": 20
      },
      {
        "name": "GCP-repl-node",
        "deployedOn": "GCP",
        "hostname": "35.202.77.170",
        "vms": 1,
        "status": "online",
        "type": "Recovery",
        "usage": 20
      }
    ]
    res.send(response);
  });

};
