module.exports = app => {
  let data = [{"id":6,"name":"Windows-2016-replication-to-gcp","protectedSite":{"id":1,"siteType":"Protection","platformDetails":{"id":1,"platformName":"vmware","platformType":"VMware","hostname":"54.38.208.200","port":443,"username":"administrator@vsphere.local","password":"DHrvzu46piMLgXvNkYJRenVihxlK1QPUaEdw3/1wkCagm51/sH0=","region":"","availZone":"","secretKey":"","accessKey":"","projectId":"","serverIp":"54.38.208.205","serverPort":5000},"description":"vmware"},"recoverySite":{"id":2,"siteType":"Recovery","platformDetails":{"id":2,"platformName":"gcp","platformType":"GCP","hostname":"","port":443,"username":"","password":"","region":"us-central1","availZone":"us-central1-a","secretKey":"","accessKey":"","projectId":"datamotivedev","serverIp":"34.69.32.104","serverPort":5001},"description":"gcp"},"protectedEntities":{"id":6,"name":"dummy","virtualMachines":[{"id":7,"name":"prod-win-2016-demo-207","moref":"vm-140","virtualDisks":[{"id":8,"devicekey":2000,"size":50}],"summary":"","guestOS":"Microsoft Windows Server 2016 or later (64-bit)","datastore":"","fileLayout":"","snapshotInfo":"","lastRunTime":0,"recoveryStatus":""}]},"recoveryEntities":{"id":6,"name":"dummy","instanceDetails":[{"id":7,"instanceName":"prod-win-2016-demo-207","instanceID":"","instanceType":"n1-standard-1","volumeType":"pd-standard","tags":[],"isPublicIP":true,"publicIP":"","privateIP":"","securityGroups":"http-server,https-server","bootPriority":1,"preScript":"","postScript":""}]},"replicationInterval":10,"retryCount":0,"failureActions":"","throttleTime":"","throttleBandwidth":0,"isEncryptionOnWire":true,"isEncryptionOnRest":true,"isCompression":true,"isDedupe":false,"preScript":"","postScript":"","subnet":"default","status":"Started","recoveryStatus":"","remoteProtectionPlanId":6},{"id":7,"name":"Ubuntu-18-protection-gcp","protectedSite":{"id":1,"siteType":"Protection","platformDetails":{"id":1,"platformName":"vmware","platformType":"VMware","hostname":"54.38.208.200","port":443,"username":"administrator@vsphere.local","password":"DHrvzu46piMLgXvNkYJRenVihxlK1QPUaEdw3/1wkCagm51/sH0=","region":"","availZone":"","secretKey":"","accessKey":"","projectId":"","serverIp":"54.38.208.205","serverPort":5000},"description":"vmware"},"recoverySite":{"id":2,"siteType":"Recovery","platformDetails":{"id":2,"platformName":"gcp","platformType":"GCP","hostname":"","port":443,"username":"","password":"","region":"us-central1","availZone":"us-central1-a","secretKey":"","accessKey":"","projectId":"datamotivedev","serverIp":"34.69.32.104","serverPort":5001},"description":"gcp"},"protectedEntities":{"id":7,"name":"dummy","virtualMachines":[{"id":8,"name":"prod-ubuntu-18-04","moref":"vm-148","virtualDisks":[{"id":9,"devicekey":2000,"size":50}],"summary":"","guestOS":"Ubuntu Linux (64-bit)","datastore":"","fileLayout":"","snapshotInfo":"","lastRunTime":1620196720,"recoveryStatus":"Test Recovered"}]},"recoveryEntities":{"id":7,"name":"dummy","instanceDetails":[{"id":8,"instanceName":"prod-ubuntu-18-04","instanceID":"","instanceType":"n1-standard-1","volumeType":"pd-balanced","tags":[],"isPublicIP":true,"publicIP":"","privateIP":"","securityGroups":"http-server,https-server","bootPriority":1,"preScript":"","postScript":""}]},"replicationInterval":10,"retryCount":0,"failureActions":"","throttleTime":"","throttleBandwidth":0,"isEncryptionOnWire":true,"isEncryptionOnRest":true,"isCompression":true,"isDedupe":false,"preScript":"","postScript":"","subnet":"default","status":"Stopped","recoveryStatus":"","remoteProtectionPlanId":7},{"id":8,"name":"Ubuntu-16-protection-gcp","protectedSite":{"id":1,"siteType":"Protection","platformDetails":{"id":1,"platformName":"vmware","platformType":"VMware","hostname":"54.38.208.200","port":443,"username":"administrator@vsphere.local","password":"DHrvzu46piMLgXvNkYJRenVihxlK1QPUaEdw3/1wkCagm51/sH0=","region":"","availZone":"","secretKey":"","accessKey":"","projectId":"","serverIp":"54.38.208.205","serverPort":5000},"description":"vmware"},"recoverySite":{"id":2,"siteType":"Recovery","platformDetails":{"id":2,"platformName":"gcp","platformType":"GCP","hostname":"","port":443,"username":"","password":"","region":"us-central1","availZone":"us-central1-a","secretKey":"","accessKey":"","projectId":"datamotivedev","serverIp":"34.69.32.104","serverPort":5001},"description":"gcp"},"protectedEntities":{"id":8,"name":"dummy","virtualMachines":[{"id":9,"name":"prod-ubuntu-16-04","moref":"vm-144","virtualDisks":[{"id":10,"devicekey":2000,"size":20},{"id":11,"devicekey":2001,"size":30}],"summary":"","guestOS":"Ubuntu Linux (64-bit)","datastore":"","fileLayout":"","snapshotInfo":"","lastRunTime":0,"recoveryStatus":""}]},"recoveryEntities":{"id":8,"name":"dummy","instanceDetails":[{"id":9,"instanceName":"prod-ubuntu-16-04","instanceID":"","instanceType":"n1-standard-1","volumeType":"pd-standard","tags":[],"isPublicIP":true,"publicIP":"","privateIP":"","securityGroups":"http-server,https-server","bootPriority":1,"preScript":"","postScript":""}]},"replicationInterval":15,"retryCount":0,"failureActions":"","throttleTime":"","throttleBandwidth":0,"isEncryptionOnWire":true,"isEncryptionOnRest":true,"isCompression":true,"isDedupe":false,"preScript":"","postScript":"","subnet":"default","status":"Stopped","recoveryStatus":"","remoteProtectionPlanId":8},{"id":9,"name":"Multi-VM-protection-to-gcp","protectedSite":{"id":1,"siteType":"Protection","platformDetails":{"id":1,"platformName":"vmware","platformType":"VMware","hostname":"54.38.208.200","port":443,"username":"administrator@vsphere.local","password":"DHrvzu46piMLgXvNkYJRenVihxlK1QPUaEdw3/1wkCagm51/sH0=","region":"","availZone":"","secretKey":"","accessKey":"","projectId":"","serverIp":"54.38.208.205","serverPort":5000},"description":"vmware"},"recoverySite":{"id":2,"siteType":"Recovery","platformDetails":{"id":2,"platformName":"gcp","platformType":"GCP","hostname":"","port":443,"username":"","password":"","region":"us-central1","availZone":"us-central1-a","secretKey":"","accessKey":"","projectId":"datamotivedev","serverIp":"34.69.32.104","serverPort":5001},"description":"gcp"},"protectedEntities":{"id":9,"name":"dummy","virtualMachines":[{"id":10,"name":"prod-win-2016","moref":"vm-150","virtualDisks":[{"id":12,"devicekey":2000,"size":50}],"summary":"","guestOS":"Microsoft Windows Server 2016 or later (64-bit)","datastore":"","fileLayout":"","snapshotInfo":"","lastRunTime":0,"recoveryStatus":""},{"id":11,"name":"prod-centos-7-02","moref":"vm-234","virtualDisks":[{"id":13,"devicekey":2000,"size":30}],"summary":"","guestOS":"CentOS 7 (64-bit)","datastore":"","fileLayout":"","snapshotInfo":"","lastRunTime":0,"recoveryStatus":""}]},"recoveryEntities":{"id":9,"name":"dummy","instanceDetails":[{"id":10,"instanceName":"prod-win-2016","instanceID":"","instanceType":"n1-standard-1","volumeType":"pd-standard","tags":[],"isPublicIP":true,"publicIP":"","privateIP":"","securityGroups":"http-server,https-server","bootPriority":1,"preScript":"","postScript":""},{"id":11,"instanceName":"prod-centos-7-02","instanceID":"","instanceType":"n1-standard-1","volumeType":"pd-standard","tags":[],"isPublicIP":true,"publicIP":"","privateIP":"","securityGroups":"http-server,https-server","bootPriority":1,"preScript":"","postScript":""}]},"replicationInterval":15,"retryCount":0,"failureActions":"","throttleTime":"","throttleBandwidth":0,"isEncryptionOnWire":true,"isEncryptionOnRest":true,"isCompression":true,"isDedupe":false,"preScript":"","postScript":"","subnet":"default","status":"Started","recoveryStatus":"","remoteProtectionPlanId":9}];
  app.get("/api/v1/protection/plans", (req, res) => {
    res.send(data);
  });
  app.get("/api/v1/protection/plans/:id", (req, res) => {
    const id = req.params.id
    let response = {};
    data.forEach(plan => {
      if (plan.id == id) {
        response = plan;
      }
    });
    res.send(response);
  });

  app.post("/api/v1/protection/plans/:id/start", (req, res) => {
    const id = req.params.id
    let response = {};
    data.forEach(plan => {
      if (plan.id == id) {
        plan.status = "Started";
      }
    });
    res.send({message: "Protection plan started."});
  });
  app.post("/api/v1/protection/plans/:id/stop", (req, res) => {
    const id = req.params.id
    let response = {};
    data.forEach(plan => {
      if (plan.id == id) {
        plan.status = "Stopped";
        response = plan;
      }
    });
    res.send({message: "Protection plan stopped."});
  });
  app.delete("/api/v1/protection/plans/:id", (req, res) => {
    const id = req.params.id
    let response = [];
    data.forEach(plan => {
      if (plan.id != id) {
        response.push(plan);        
      }
    });
    data = response;
    res.send({});
  });
  app.post("/api/v1/protection/plans", (req, res) => {
    const newID = data.length * 2  + 1;
    const obj = req.body;
    obj.id = newID;
    data.push(obj);
    res.send(obj);
  });
};
