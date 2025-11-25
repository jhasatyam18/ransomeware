module.exports = app => {
  const response = [{ "id": 1, "topic": "Migration", "description": "Migrated Virtual machines prod-windows-server-2016, prod-windows-server-2016, prod-windows-server-2016, prod-windows-server-2016, prod-windows-server-2016, prod-windows-server-2016", "level": "INFO", "affectedObjectID": 1, "type": "migration.completed", "timeStamp": 1622527277, "generator": "System" }, { "id": 2, "topic": "Recovery", "description": "Recovery Virtual machines Ubuntu-16, Centos-DB completed.", "level": "INFO", "affectedObjectID": 1, "type": "recovery.completed", "timeStamp": 1622527277, "generator": "System" }, { "id": 3, "topic": "License", "description": "License is going to expire in 10 days", "level": "WARNING", "affectedObjectID": 1, "type": "license.expiring", "timeStamp": 1622527277, "generator": "System" }, { "id": 4, "topic": "License", "description": "License Expired. Please contact datamotive support for assistance.", "level": "CRITICAL", "affectedObjectID": 1, "type": "license.expired", "timeStamp": 1622527277, "generator": "System" }, { "id": 4, "topic": "Replication", "description": "Replication failed for virtual machine VM-10.", "level": "ERROR", "affectedObjectID": 1, "type": "replication.failed", "timeStamp": 1622527277, "generator": "System" }]
  app.get("/api/v1/event", (req, res) => {
    res.send(response);
  });
  app.get("/api/v1/event/:id", (req, res) => {
    const id = req.params.id;
    let resp = {};
    response.forEach(r => {
      if (r.id == id) {
        resp = r;
      }
    })
    res.send(resp);
  });
};