module.exports = app => {
  app.get("/api/v1/info", (req, res) => {
    const response = {
      about: "Welcome to Datamotive Management Service",
      serviceType: "Client", // Client || Server
      platformType: "VMware",
      licenseType: "Trial", isLicenseExpired: false,
      licenseExpiredTime: 1622187431,
      version: "0.0.1-142"
    }
    res.send(response);
  });
};