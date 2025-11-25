const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Datamotive-Mock" });
});

require('./app/routes/site.routes.js')(app);
require('./app/routes/protection.routes')(app);
require('./app/routes/info.routes.js')(app);
require('./app/routes/dashboard.routes.js')(app);
require('./app/routes/jobs.routes.js')(app);
require('./app/routes/scripts.routes.js')(app);
require('./app/routes/recovery.routes.js')(app);
require('./app/routes/event.routes.js')(app);
require('./app/routes/alert.routes.js')(app);
require('./app/routes/node.routes.js')(app);
require('./app/routes/support.routes.js')(app);
require('./app/routes/user.routes.js')(app);

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
