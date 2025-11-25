module.exports = app => {
  app.get("/api/v1/info", (req, res) => {
    const response = {
      about: "Welcome to Datamotive Management Service",
      serviceType: "Client", // Client || Server
      platformType: "AWS",
      licenseType: "Trial", isLicenseExpired: false,
      licenseExpiredTime: 1627969313,
      version: "0.0.1-142",
      localVMIP: "3.236.198.205"
    }
    res.send(response);
  });
};