module.exports = app => {
  // mock-data
  let data = [
    {
      "id": 1,
      "name": "Local Node",
      "hostname": "54.38.208.201",
      "username": "admin",
      "password": "*****",
      "nodeType": "Management",
      "platformType": "VMware",
      "managementPort": 5000,
      "replicationPort": 5001,
      "isLocalNode": true,
      "status": "online",
      "encryptionKey": ""
    },
    {
      "id": 2,
      "name": "AWS_Node",
      "hostname": "3.19.27.244",
      "username": "admin",
      "password": "*****",
      "nodeType": "Management",
      "platformType": "AWS",
      "managementPort": 5000,
      "replicationPort": 5001,
      "isLocalNode": false,
      "status": "online",
      "encryptionKey": ""
    },
    {
      "id": 3,
      "name": "TEST-DEDUPE",
      "hostname": "54.38.208.206",
      "username": "admin",
      "password": "*****",
      "nodeType": "DedupeServer",
      "platformType": "",
      "managementPort": 5000,
      "replicationPort": 5001,
      "isLocalNode": false,
      "status": "online",
      "encryptionKey": ""
    },
    {
      "id": 4,
      "name": "TEST-Replication",
      "hostname": "3.19.27.244",
      "username": "admin",
      "password": "*****",
      "nodeType": "Replication",
      "platformType": "AWS",
      "managementPort": 5000,
      "replicationPort": 5001,
      "isLocalNode": false,
      "status": "online",
      "encryptionKey": ""
    },
    {
      "id": 5,
      "name": "TEST-Management",
      "hostname": "3.19.27.244",
      "username": "admin",
      "password": "*****",
      "nodeType": "Management",
      "platformType": "AWS",
      "managementPort": 5000,
      "replicationPort": 5001,
      "isLocalNode": false,
      "status": "online",
      "encryptionKey": ""
    }
  ];
  // Create New Node
  app.post("/api/v1/nodes", (req, res) => {
    const newID = new Date().getTime();
    const obj = req.body;
    obj.id = newID;
    obj.status = "online";
    data.push(obj);
    res.send(obj);
  });

  // Move node to online
  app.post("/api/v1/nodes/:id/online", (req, res) => {
    const id = req.params.id
    console.log("Moving node to offline " + id);
    let response = [];
    data.forEach(node => {
      if (node.id == id) {
        node.status = "online";
      }
      response.push(node);
    });
    data = response;
    res.send(id);
  });

  // get encryption key of node
  app.post("/api/v1/nodes/:id/encryption", (req, res) => {
    res.send(JSON.stringify("234jhad287348aldssd4165f6s1d6sg464asdasn87"));
  });
  // Move node to offline
  app.post("/api/v1/nodes/:id/offline", (req, res) => {
    const id = req.params.id
    let response = [];
    data.forEach(node => {
      if (node.id == id) {
        node.status = "offline";
      }
      response.push(node);
    });
    data = response;
    res.send({});
  });

  // Modify Node
  app.put("/api/v1/nodes/:id", (req, res) => {
    const ID = req.body.id;
    console.log("Modifying node for ID :" + ID);
    data.forEach(node => {
      if (node.id != ID) {
        console.log("Updating node info");
        node = res.body;
      }
    });
    res.send(req.body);
  });

  // Delete Node
  app.delete("/api/v1/nodes/:id", (req, res) => {
    const id = req.params.id
    let response = [];
    data.forEach(node => {
      if (node.id != id) {
        response.push(node);
      }
    });
    data = response;
    res.send({});
  });

  // Get All Nodes
  app.get("/api/v1/nodes", (req, res) => {
    res.send(data);
  });

};
