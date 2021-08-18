module.exports = app => {
  // mock-data
  let data = [{"id":1,"name":"VMware","siteType":"Protection","description":"VMware Site","platformDetails":{"id":1,"platformType":"VMware","hostname":"54.38.208.207","port":443,"username":"administrator@vsphere.local","password":"*****","region":"","availZone":"","secretKey":"","accessKey":"","projectId":""},"node":{"id":1,"name":"Local Node","hostname":"54.38.208.206","username":"admin","password":"*****","nodeType":"Management","platformType":"VMware","managementPort":5000,"replicationPort":5001,"isLocalNode":true,"status":"online","encryptionKey":""},"isUpdated":false},{"id":4,"name":"AWS","siteType":"Recovery","description":"AWS Site","platformDetails":{"id":4,"platformType":"AWS","hostname":"","port":443,"username":"","password":"","region":"us-east-1","availZone":"us-east-1c","secretKey":"*****","accessKey":"AKIARWF3J3WPDUSOS6PJ","projectId":""},"node":{"id":3,"name":"AWS-repl-node-v2","hostname":"3.236.198.205","username":"admin","password":"*****","nodeType":"Management","platformType":"AWS","managementPort":5000,"replicationPort":5001,"isLocalNode":false,"status":"online","encryptionKey":""},"isUpdated":false},{"id":6,"name":"AWS site 2","siteType":"Recovery","description":"AWS new site","platformDetails":{"id":6,"platformType":"AWS","hostname":"","port":443,"username":"","password":"","region":"us-east-1","availZone":"us-east-1c","secretKey":"*****","accessKey":"AKIARWF3J3WPDUSOS6PJ","projectId":""},"node":{"id":4,"name":"AWS-repl-node","hostname":"100.27.6.177","username":"admin","password":"*****","nodeType":"Management","platformType":"AWS","managementPort":5000,"replicationPort":5001,"isLocalNode":false,"status":"online","encryptionKey":""},"isUpdated":false}];
  let vms = [{ "id": 0, "name": "prod-win-2016-demo-204", "moref": "vm-157", "virtualDisks": [{ "id": 0, "devicekey": 2000, "size": 50 }], "summary": "", "guestOS": "Microsoft Windows Server 2016 or later (64-bit)", "datastore": "", "fileLayout": "", "snapshotInfo": "", "lastRunTime": 0, "recoveryStatus": "" }, { "id": 0, "name": "prod-win-2016-demo-206", "moref": "vm-139", "virtualDisks": [{ "id": 0, "devicekey": 2000, "size": 50 }], "summary": "", "guestOS": "Microsoft Windows Server 2016 or later (64-bit)", "datastore": "", "fileLayout": "", "snapshotInfo": "", "lastRunTime": 0, "recoveryStatus": "" }, { "id": 0, "name": "Datamotive_Jenkins", "moref": "vm-147", "virtualDisks": [{ "id": 0, "devicekey": 2000, "size": 50 }], "summary": "", "guestOS": "CentOS 7 (64-bit)", "datastore": "", "fileLayout": "", "snapshotInfo": "", "lastRunTime": 0, "recoveryStatus": "" }, { "id": 0, "name": "prod-rhel-7", "moref": "vm-155", "virtualDisks": [{ "id": 0, "devicekey": 2000, "size": 50 }], "summary": "", "guestOS": "Red Hat Enterprise Linux 7 (64-bit)", "datastore": "", "fileLayout": "", "snapshotInfo": "", "lastRunTime": 0, "recoveryStatus": "" }, { "id": 0, "name": "prod-centos-7-03", "moref": "vm-145", "virtualDisks": [{ "id": 0, "devicekey": 2000, "size": 30 }], "summary": "", "guestOS": "CentOS 4/5 or later (64-bit)", "datastore": "", "fileLayout": "", "snapshotInfo": "", "lastRunTime": 0, "recoveryStatus": "" }, { "id": 0, "name": "prod-win-2016", "moref": "vm-150", "virtualDisks": [{ "id": 0, "devicekey": 2000, "size": 50 }], "summary": "", "guestOS": "Microsoft Windows Server 2016 or later (64-bit)", "datastore": "", "fileLayout": "", "snapshotInfo": "", "lastRunTime": 0, "recoveryStatus": "" }, { "id": 0, "name": "prod-centos-7", "moref": "vm-153", "virtualDisks": [{ "id": 0, "devicekey": 2000, "size": 50 }], "summary": "", "guestOS": "CentOS 4/5 or later (64-bit)", "datastore": "", "fileLayout": "", "snapshotInfo": "", "lastRunTime": 0, "recoveryStatus": "" }, { "id": 0, "name": "windows-2016-test", "moref": "vm-159", "virtualDisks": [{ "id": 0, "devicekey": 2000, "size": 20 }], "summary": "", "guestOS": "Microsoft Windows Server 2016 or later (64-bit)", "datastore": "", "fileLayout": "", "snapshotInfo": "", "lastRunTime": 0, "recoveryStatus": "" }, { "id": 0, "name": "prod-centos-7-02", "moref": "vm-234", "virtualDisks": [{ "id": 0, "devicekey": 2000, "size": 30 }], "summary": "", "guestOS": "CentOS 7 (64-bit)", "datastore": "", "fileLayout": "", "snapshotInfo": "", "lastRunTime": 0, "recoveryStatus": "" }, { "id": 0, "name": "prod-centos-7-04", "moref": "vm-252", "virtualDisks": [{ "id": 0, "devicekey": 2000, "size": 30 }], "summary": "", "guestOS": "CentOS 7 (64-bit)", "datastore": "", "fileLayout": "", "snapshotInfo": "", "lastRunTime": 0, "recoveryStatus": "" }, { "id": 0, "name": "windows-2016-test_clone", "moref": "vm-268", "virtualDisks": [{ "id": 0, "devicekey": 2000, "size": 20 }], "summary": "", "guestOS": "Microsoft Windows Server 2016 or later (64-bit)", "datastore": "", "fileLayout": "", "snapshotInfo": "", "lastRunTime": 0, "recoveryStatus": "" }];
  let networks = { "subnets": [{ "id": "default", "name": "10.128.0.0/20" }], "securityGroups": [{ "id": "http-server", "name": "" }, { "id": "https-server", "name": "" }] };
  app.get("/api/v1/sites", (req, res) => {
    res.send(data);
  });

  app.get("/api/v1/sites/:id/vms", (req, res) => {
    res.send(vms);
  });

  app.post("/api/v1/sites", (req, res) => {
    const newID = data.length * 5 + 1;
    const obj = req.body;
    obj.id = newID;
    data.push(obj);
    res.send(obj);
  });

  app.delete("/api/v1/sites/:id", (req, res) => {
    const id = req.params.id
    let response = [];
    data.forEach(site => {
      if (site.id != id) {
        response.push(site);
      }
    });
    data = response;
    res.send({});
  });

  app.get("/api/v1/sites/:id/networks", (req, res) => {
    res.send(networks);
  });

  app.put("/api/v1/sites/:id", (req, res) => {
    const ID = req.body.id;
    data.forEach(site => {
      if (site.id != ID) {
        site = res.body;
      }
    });
    res.send(req.body);
  });
};
