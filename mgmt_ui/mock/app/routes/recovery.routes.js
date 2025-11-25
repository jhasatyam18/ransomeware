module.exports = app => {
  app.post("/api/v1/recover/validate", (req, res) => {
    const response = {"failedVMs":null,"warningVMs":null}
    res.send(response);
  });
  app.post("/api/v1/recover", (req, res) => {
    const response = {"id":2,"protectionPlanID":8,"vmNames":"prod-ubuntu-16-04","startTime":1620226289,"endTime":0,"recoveryType":"full recovery","status":"started","failureMessage":""}
    res.send(response);
  });

  app.post("/api/v1/migrate/validate", (req, res) => {
    const response = {"failedVMs":null,"warningVMs":null}
    res.send(response);
  });

  app.post("/api/v1/migrate", (req, res) => {
    const response = {"id":2,"protectionPlanID":8,"vmNames":"prod-ubuntu-16-04","startTime":1620226289,"endTime":0,"recoveryType":"full recovery","status":"started","failureMessage":""}
    res.send(response);
  });
};