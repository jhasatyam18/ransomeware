module.exports = app => {
  const data = [
    {  "id": 29, "name": "Datamotive_SB_07-20-2021-15-27-49", "description": "TEST Bundle", "generatedBy": "admin", 
        "bundleUrl": "/support/Datamotive_SB_07-20-2021-15-27-49-00.tar.gz",
        "bundleSize": 51200, "status": "completed", "uuid": "82587ec2-7a43-4087-8e28-2edc3cc0404d", "generatedAt": 1626775069, "errorMessage": ""
    },
    {  "id": 29, "name": "Datamotive_SB_07-20-2021-15-27-50", "description": "Bug-1101", "generatedBy": "admin", 
        "bundleUrl": "/support/Datamotive_SB_07-20-2021-15-27-50.tar.gz",
        "bundleSize": 51200, "status": "completed", "uuid": "83587ec2-7a43-4087-8e28-2edc3cc0404d", "generatedAt": 1626775069, "errorMessage": ""
    },
]
  app.get("/api/v1/support/bundle", (req, res) => {
    res.send(data);
  });

   // Create New Node
   app.post("/api/v1/support/bundle", (req, res) => {
    const dt= new Date().getTime();
    const newID = dt;
    const obj = req.body;
    
    obj.id = newID;
    obj.name = dt;
    obj.bundleUrl = "/support/Datamotive_SB_07-20-2021-15-27-49-00.tar.gz";
    obj.bundleSize = 125874569;
    obj.status = "completed"
    obj.uuid = dt;
    obj.generatedAt = new Date().getUTCDate();
    obj.errorMessage = "";
    data.push(obj);
    res.send(obj);
  });

    // Delete sundle
    app.delete("/api/v1/support/bundle/:id", (req, res) => {
      const id = req.params.id
      let response = [];
      data.forEach(b => {
        if (b.id != id) {
          response.push(node);
        }
      });
      data = response;
      res.send({});
    });
};