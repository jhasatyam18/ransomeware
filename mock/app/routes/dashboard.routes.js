module.exports = app => {
  app.get("/api/v1/dashboard/titles", (req, res) => {
    const response = { "siteCount": 20, "rpo": 204, "rto": 902, "protectionPlans": 3, "siteConnections": [{ "source": "vmware", "target": "aws" }], "protectedVMs": 3, "protectedStorage": 150 };
    res.send(response);
  });

  app.get("/api/v1/dashboard/recoverystats", (req, res) => {
    const response = {
      "testExecutions": 50,
      "fullRecovery": 10,
      "migrations": 12
    }
    res.send(response);
  });

  app.get("/api/v1/dashboard/replicationstats", (req, res) => {
    const response = {
      "completed": 81,
      "failed": 3,
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
};