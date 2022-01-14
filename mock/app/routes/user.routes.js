module.exports = app => {
  app.get("/api/v1/roles", (req, res) => {
    const response = {"id":1,"username":"Administrator","password":"uspwWnirOtS3/MbZ+ZfX1BKg99blz1HuY3W9evWwr7iv","email":"Administrator","roles":[{"id":2,"name":"Administrator","roleID":0,"privileges":null,"users":null}]};
    res.send(response);
  });

  app.get("/api/v1/roles/:id", (req, res) => {
    const response = {"id":1,"name":"Read Only","roleID":0,"privileges":[{"id":3,"name":"list Alerts","privilegeID":"alerts.list","roles":null},{"id":5,"name":"List Report","privilegeID":"report.list","roles":null},{"id":8,"name":"List License","privilegeID":"license.list","roles":null},{"id":11,"name":"List Node","privilegeID":"node.list","roles":null},{"id":19,"name":"list Events","privilegeID":"events.list","roles":null},{"id":22,"name":"List Email","privilegeID":"email.list","roles":null},{"id":24,"name":"List Throttling","privilegeID":"throttling.list","roles":null},{"id":27,"name":"List Support","privilegeID":"support.list","roles":null},{"id":31,"name":"List Site","privilegeID":"site.list","roles":null},{"id":36,"name":"List Protection Plan","privilegeID":"protectionplan.list","roles":null}],"users":[{"id":3,"username":"ReadUser","password":"Hl+zRqmZxFb3lcGITeXJV0OOe1ZsgoPBxbOCC4eVHjvX","email":"Read Only","roles":null}]};
    res.send(response);
  });

  app.get("/api/v1/users/:id", (req, res) => {
    const response = {"id":1,"username":"Administrator","password":"uspwWnirOtS3/MbZ+ZfX1BKg99blz1HuY3W9evWwr7iv","email":"Administrator","roles":[{"id":2,"name":"Administrator","roleID":0,"privileges":null,"users":null}]};
    res.send(response);
  });

  app.get("/api/v1/users/:id/privileges", (req, res) => {
    const response = ["alerts.acknowledge","alerts.list","report.create","report.list","license.create","license.delete","license.list","node.edit","node.delete","node.list","node.status","node.create","recovery.test","recovery.full","recovery.migration","jobs.replication","jobs.recovery","events.list","email.config","email.delete","email.list","throttling.Config","throttling.list","support.create","support.delete","support.list","site.create","site.edit","site.delete","site.list","protectionplan.status","protectionplan.create","protectionplan.edit","protectionplan.delete","protectionplan.list"]
    res.send(response);
  });

  app.get("/api/v1/users", (req, res) => {
    const response = [
      {
        "id": 1,
        "username": "Administrator",
        "password": "uspwWnirOtS3/MbZ+ZfX1BKg99blz1HuY3W9evWwr7iv",
        "email": "Administrator",
        "roles": [
          {
            "id": 2,
            "name": "Administrator",
            "roleID": 0,
            "privileges": null,
            "users": null
          }
        ]
      },
      {
        "id": 2,
        "username": "BackupAdmin",
        "password": "ewfr/4xJCoF+2LyFmehGILsxpAJyzIaJsJwJBYWYhnxz",
        "email": "Backup Admin",
        "roles": [
          {
            "id": 3,
            "name": "Backup Admin",
            "roleID": 0,
            "privileges": null,
            "users": null
          }
        ]
      },
      {
        "id": 3,
        "username": "ReadUser",
        "password": "Hl+zRqmZxFb3lcGITeXJV0OOe1ZsgoPBxbOCC4eVHjvX",
        "email": "Read Only",
        "roles": [
          {
            "id": 1,
            "name": "Read Only",
            "roleID": 0,
            "privileges": null,
            "users": null
          }
        ]
      }
    ]

    res.send(response);
  });
};