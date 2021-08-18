module.exports = app => {
  let data = [{"id":1,"name":"Windows-2012-repl-AWS-single-disk","protectedSite":{"id":1,"name":"VMware","siteType":"Protection","description":"VMware Site","platformDetails":{"id":1,"platformType":"VMware","hostname":"54.38.208.207","port":443,"username":"administrator@vsphere.local","password":"SEz3FCrpU12aiShFNF40oIkBA9VBUn5XabjnpOuiXMuI7Hbco72R5AJAPg==","region":"","availZone":"","secretKey":"","accessKey":"","projectId":""},"node":{"id":1,"name":"Local Node","hostname":"54.38.208.206","username":"admin","password":"qLISvTyxkIpVfYEmbdNwOHPojOxWbwP0NrfKLAOQMj0eFVAj8Bhz8PXJ","nodeType":"Management","platformType":"VMware","managementPort":5000,"replicationPort":5001,"isLocalNode":true,"status":"online","encryptionKey":""},"isUpdated":false},"recoverySite":{"id":4,"name":"AWS","siteType":"Recovery","description":"AWS Site","platformDetails":{"id":4,"platformType":"AWS","hostname":"","port":443,"username":"","password":"","region":"us-east-1","availZone":"us-east-1c","secretKey":"HCyLCxDXrzqZLvapm01xO5nTN9eA4bCrv8SFylcLc/ZR269we+WtvUTV1GBNFjXXHLlF7IAeGZ/Dfpbe0kDM1WRtTVw=","accessKey":"AKIARWF3J3WPDUSOS6PJ","projectId":""},"node":{"id":3,"name":"AWS-repl-node-v2","hostname":"3.236.198.205","username":"admin","password":"2kTLeRREI0NNvOhomTlJ8CyAJR23jWqs7bw7Y5oHpRCNkcjd9qTRbYMp","nodeType":"Management","platformType":"AWS","managementPort":5000,"replicationPort":5001,"isLocalNode":false,"status":"online","encryptionKey":""},"isUpdated":false},"protectedEntities":{"id":1,"name":"dummy","virtualMachines":[{"id":1,"name":"prod-Win-srv-2012-RR-test-single-disk","moref":"vm-350","virtualDisks":[{"id":1,"devicekey":"2000","size":20,"snapshotId":""}],"summary":"","guestOS":"Microsoft Windows Server 2016 or later (64-bit)","datastore":"datastore-305","fileLayout":"","snapshotInfo":"","lastRunTime":0,"recoveryStatus":""}]},"recoveryEntities":{"id":1,"name":"dummy","instanceDetails":[{"id":1,"instanceName":"prod-Win-srv-2012-RR-test-single-disk","instanceID":"","instanceType":"t2.micro","volumeType":"gp2","tags":[],"isPublicIP":true,"publicIP":"","privateIP":"","securityGroups":"sg-7da9977a","bootPriority":1,"preScript":"","postScript":""}]},"replicationInterval":10,"retryCount":0,"failureActions":"","throttleTime":"","throttleBandwidth":0,"isEncryptionOnWire":false,"isEncryptionOnRest":false,"isCompression":true,"isDedupe":false,"preScript":"","postScript":"","subnet":"subnet-dfcdb6b9","status":"Stopped","recoveryStatus":"","remoteProtectionPlanId":1},{"id":2,"name":"Windows-multi-disk","protectedSite":{"id":1,"name":"VMware","siteType":"Protection","description":"VMware Site","platformDetails":{"id":1,"platformType":"VMware","hostname":"54.38.208.207","port":443,"username":"administrator@vsphere.local","password":"SEz3FCrpU12aiShFNF40oIkBA9VBUn5XabjnpOuiXMuI7Hbco72R5AJAPg==","region":"","availZone":"","secretKey":"","accessKey":"","projectId":""},"node":{"id":1,"name":"Local Node","hostname":"54.38.208.206","username":"admin","password":"qLISvTyxkIpVfYEmbdNwOHPojOxWbwP0NrfKLAOQMj0eFVAj8Bhz8PXJ","nodeType":"Management","platformType":"VMware","managementPort":5000,"replicationPort":5001,"isLocalNode":true,"status":"online","encryptionKey":""},"isUpdated":false},"recoverySite":{"id":4,"name":"AWS","siteType":"Recovery","description":"AWS Site","platformDetails":{"id":4,"platformType":"AWS","hostname":"","port":443,"username":"","password":"","region":"us-east-1","availZone":"us-east-1c","secretKey":"HCyLCxDXrzqZLvapm01xO5nTN9eA4bCrv8SFylcLc/ZR269we+WtvUTV1GBNFjXXHLlF7IAeGZ/Dfpbe0kDM1WRtTVw=","accessKey":"AKIARWF3J3WPDUSOS6PJ","projectId":""},"node":{"id":3,"name":"AWS-repl-node-v2","hostname":"3.236.198.205","username":"admin","password":"2kTLeRREI0NNvOhomTlJ8CyAJR23jWqs7bw7Y5oHpRCNkcjd9qTRbYMp","nodeType":"Management","platformType":"AWS","managementPort":5000,"replicationPort":5001,"isLocalNode":false,"status":"online","encryptionKey":""},"isUpdated":false},"protectedEntities":{"id":2,"name":"dummy","virtualMachines":[{"id":2,"name":"prod-win-server-2012","moref":"vm-313","virtualDisks":[{"id":2,"devicekey":"2000","size":20,"snapshotId":""},{"id":3,"devicekey":"2001","size":20,"snapshotId":""}],"summary":"","guestOS":"Microsoft Windows Server 2016 or later (64-bit)","datastore":"datastore-305","fileLayout":"","snapshotInfo":"","lastRunTime":0,"recoveryStatus":""}]},"recoveryEntities":{"id":2,"name":"dummy","instanceDetails":[{"id":2,"instanceName":"prod-win-server-2012","instanceID":"","instanceType":"t2.micro","volumeType":"gp2","tags":[],"isPublicIP":true,"publicIP":"","privateIP":"","securityGroups":"sg-7da9977a","bootPriority":1,"preScript":"","postScript":""}]},"replicationInterval":10,"retryCount":0,"failureActions":"","throttleTime":"","throttleBandwidth":0,"isEncryptionOnWire":false,"isEncryptionOnRest":false,"isCompression":true,"isDedupe":false,"preScript":"","postScript":"","subnet":"subnet-dfcdb6b9","status":"Stopped","recoveryStatus":"","remoteProtectionPlanId":2},{"id":3,"name":"Windows-multi-disk-AWS-site-2","protectedSite":{"id":1,"name":"VMware","siteType":"Protection","description":"VMware Site","platformDetails":{"id":1,"platformType":"VMware","hostname":"54.38.208.207","port":443,"username":"administrator@vsphere.local","password":"SEz3FCrpU12aiShFNF40oIkBA9VBUn5XabjnpOuiXMuI7Hbco72R5AJAPg==","region":"","availZone":"","secretKey":"","accessKey":"","projectId":""},"node":{"id":1,"name":"Local Node","hostname":"54.38.208.206","username":"admin","password":"qLISvTyxkIpVfYEmbdNwOHPojOxWbwP0NrfKLAOQMj0eFVAj8Bhz8PXJ","nodeType":"Management","platformType":"VMware","managementPort":5000,"replicationPort":5001,"isLocalNode":true,"status":"online","encryptionKey":""},"isUpdated":false},"recoverySite":{"id":6,"name":"AWS site 2","siteType":"Recovery","description":"AWS new site","platformDetails":{"id":6,"platformType":"AWS","hostname":"","port":443,"username":"","password":"","region":"us-east-1","availZone":"us-east-1c","secretKey":"6KZmO3ZRIxtJi2TRdJB6GY0PQqqxIdTBKj3Z7tjW1O/WJeTFYrLssoAIkmWPdtHl6rpgw28WWX3foZ1z4SQSiHIeBsI=","accessKey":"AKIARWF3J3WPDUSOS6PJ","projectId":""},"node":{"id":4,"name":"AWS-repl-node","hostname":"100.27.6.177","username":"admin","password":"cYCbpkGR8o/5SjnH0evRJRsM5hS3LtJ/aJITVcqZn31z7qiJBPVNRJMi","nodeType":"Management","platformType":"AWS","managementPort":5000,"replicationPort":5001,"isLocalNode":false,"status":"online","encryptionKey":""},"isUpdated":false},"protectedEntities":{"id":3,"name":"dummy","virtualMachines":[{"id":3,"name":"prod-win-srv-2012","moref":"vm-348","virtualDisks":[{"id":4,"devicekey":"2000","size":20,"snapshotId":""},{"id":5,"devicekey":"2001","size":20,"snapshotId":""}],"summary":"","guestOS":"Microsoft Windows Server 2016 or later (64-bit)","datastore":"datastore-305","fileLayout":"","snapshotInfo":"","lastRunTime":0,"recoveryStatus":""}]},"recoveryEntities":{"id":3,"name":"dummy","instanceDetails":[{"id":3,"instanceName":"prod-win-srv-2012","instanceID":"","instanceType":"t2.micro","volumeType":"gp2","tags":[],"isPublicIP":true,"publicIP":"","privateIP":"","securityGroups":"sg-7da9977a","bootPriority":1,"preScript":"","postScript":""}]},"replicationInterval":10,"retryCount":0,"failureActions":"","throttleTime":"","throttleBandwidth":0,"isEncryptionOnWire":false,"isEncryptionOnRest":false,"isCompression":true,"isDedupe":false,"preScript":"","postScript":"","subnet":"subnet-dfcdb6b9","status":"Stopped","recoveryStatus":"","remoteProtectionPlanId":1}];
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
