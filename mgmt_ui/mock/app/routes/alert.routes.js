module.exports = app => {
  let response = [{"id":1,"description":"Migrated Virtual machines prod-windows-server-2016","title":"Migration Completed Successfully","eventType":"migration.completed","isAcknowledge":false,"isRead":false,"eventID":2,"timeStamp":1622527282,"severity":"INFO"},{"id":2,"description":"Recovered Virtual machines prod-windows-server-2016","title":"Test Recover Completed Successfully","eventType":"recovery.test.completed","isAcknowledge":false,"isRead":false,"eventID":1,"timeStamp":1622521814,"severity":"INFO"},{"id":3,"description":"Replication failed for virtual machine vm-21","title":"Replication Failed","eventType":"replication.testfailed","isAcknowledge":false,"isRead":false,"eventID":1,"timeStamp":1622521814,"severity":"ERROR"},{"id":4,"description":"License Expiring in next 10 days","title":"Licemse Expiring","eventType":"licemse.expiring","isAcknowledge":false,"isRead":false,"eventID":1,"timeStamp":1622705192,"severity":"WARNING"},{"id":1,"description":"Migrated Virtual machines prod-windows-server-2016","title":"Migration Completed Successfully","eventType":"migration.completed","isAcknowledge":false,"isRead":false,"eventID":2,"timeStamp":1622527282,"severity":"INFO"},{"id":2,"description":"Recovered Virtual machines prod-windows-server-2016","title":"Test Recover Completed Successfully","eventType":"recovery.test.completed","isAcknowledge":false,"isRead":false,"eventID":1,"timeStamp":1622521814,"severity":"INFO"},{"id":3,"description":"Replication failed for virtual machine vm-21","title":"Replication Failed","eventType":"replication.testfailed","isAcknowledge":false,"isRead":false,"eventID":1,"timeStamp":1622521814,"severity":"ERROR"},{"id":4,"description":"License Expiring in next 10 days","title":"Licemse Expiring","eventType":"licemse.expiring","isAcknowledge":false,"isRead":false,"eventID":1,"timeStamp":1622705192,"severity":"WARNING"},{"id":1,"description":"Migrated Virtual machines prod-windows-server-2016","title":"Migration Completed Successfully","eventType":"migration.completed","isAcknowledge":false,"isRead":false,"eventID":2,"timeStamp":1622527282,"severity":"INFO"},{"id":2,"description":"Recovered Virtual machines prod-windows-server-2016","title":"Test Recover Completed Successfully","eventType":"recovery.test.completed","isAcknowledge":false,"isRead":false,"eventID":1,"timeStamp":1622521814,"severity":"INFO"},{"id":3,"description":"Replication failed for virtual machine vm-21","title":"Replication Failed","eventType":"replication.testfailed","isAcknowledge":false,"isRead":false,"eventID":1,"timeStamp":1622521814,"severity":"ERROR"},{"id":4,"description":"License Expiring in next 10 days","title":"Licemse Expiring","eventType":"licemse.expiring","isAcknowledge":false,"isRead":false,"eventID":1,"timeStamp":1622705192,"severity":"WARNING"},{"id":1,"description":"Migrated Virtual machines prod-windows-server-2016","title":"Migration Completed Successfully","eventType":"migration.completed","isAcknowledge":false,"isRead":false,"eventID":2,"timeStamp":1622527282,"severity":"INFO"},{"id":2,"description":"Recovered Virtual machines prod-windows-server-2016","title":"Test Recover Completed Successfully","eventType":"recovery.test.completed","isAcknowledge":false,"isRead":false,"eventID":1,"timeStamp":1622521814,"severity":"INFO"},{"id":3,"description":"Replication failed for virtual machine vm-21","title":"Replication Failed","eventType":"replication.testfailed","isAcknowledge":false,"isRead":false,"eventID":1,"timeStamp":1622521814,"severity":"ERROR"},{"id":4,"description":"License Expiring in next 10 days","title":"Licemse Expiring","eventType":"licemse.expiring","isAcknowledge":false,"isRead":false,"eventID":1,"timeStamp":1622705192,"severity":"WARNING"},{"id":1,"description":"Migrated Virtual machines prod-windows-server-2016","title":"Migration Completed Successfully","eventType":"migration.completed","isAcknowledge":false,"isRead":false,"eventID":2,"timeStamp":1622527282,"severity":"INFO"},{"id":2,"description":"Recovered Virtual machines prod-windows-server-2016","title":"Test Recover Completed Successfully","eventType":"recovery.test.completed","isAcknowledge":false,"isRead":false,"eventID":1,"timeStamp":1622521814,"severity":"INFO"},{"id":3,"description":"Replication failed for virtual machine vm-21","title":"Replication Failed","eventType":"replication.testfailed","isAcknowledge":false,"isRead":false,"eventID":1,"timeStamp":1622521814,"severity":"ERROR"},{"id":4,"description":"License Expiring in next 10 days","title":"Licemse Expiring","eventType":"licemse.expiring","isAcknowledge":false,"isRead":false,"eventID":1,"timeStamp":1622705192,"severity":"WARNING"},{"id":1,"description":"Migrated Virtual machines prod-windows-server-2016","title":"Migration Completed Successfully","eventType":"migration.completed","isAcknowledge":false,"isRead":false,"eventID":2,"timeStamp":1622527282,"severity":"INFO"},{"id":2,"description":"Recovered Virtual machines prod-windows-server-2016","title":"Test Recover Completed Successfully","eventType":"recovery.test.completed","isAcknowledge":false,"isRead":false,"eventID":1,"timeStamp":1622521814,"severity":"INFO"},{"id":3,"description":"Replication failed for virtual machine vm-21","title":"Replication Failed","eventType":"replication.testfailed","isAcknowledge":false,"isRead":false,"eventID":1,"timeStamp":1622521814,"severity":"ERROR"},{"id":4,"description":"License Expiring in next 10 days","title":"Licemse Expiring","eventType":"licemse.expiring","isAcknowledge":false,"isRead":false,"eventID":1,"timeStamp":1622705192,"severity":"WARNING"}]
  app.get("/api/v1/alert", (req, res) => {
    res.send(response);
  });

  app.get("/api/v1/alert/unread", (req, res) => {
    const unreadAlerts = [];
    response.forEach(r => {
      if (r.isRead == false) {
        unreadAlerts.push(r)
      }     
   });
    res.send(unreadAlerts);
  });

  app.post("/api/v1/alert/read/:id", (req, res) => {
    const id = req.params.id
    const newResponse = [];
    response.forEach(r => {
       if (r.id == id) {
         console.log("Marking alert as read for ID:" + id)
         r.isRead = true;
       }
       newResponse.push(r);
    });
    response = newResponse;
    res.send(JSON.stringify("success"));
  });
  app.post("/api/v1/alert/acknowledge/:id", (req, res) => {
    const id = req.params.id
    const newResponse = [];
    response.forEach(res => {
       if (res.id == id) {
         res.isAcknowledge = true;
       }
       newResponse.push(res)
    })
    response = newResponse;
    res.send(JSON.stringify("success"));
  });
};