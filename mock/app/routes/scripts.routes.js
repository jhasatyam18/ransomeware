module.exports = app => {
  app.get("/api/v1/scripts", (req, res) => {
    const response = {"preScripts":["JIRA", "TOMCAT", "ORACLE"],"postScripts":["osticket","wordpress"]}
    res.send(response);
  });
};