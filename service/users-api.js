const { jwtAuthz } = require('express-jwt-aserto');
const directory = require('./directory');
const { authorizerServiceUrl, applicationName } = require('./config');

// check authorization by inserting scopes in the array
const checkAuthz = (policy, resource) => jwtAuthz(policy, resource, { authorizerServiceUrl, applicationName });

// register routes for users API
exports.register = (app) => {
  app.get("/api/users", checkAuthz('peoplefinder.users.get', ''), (req, res) => {
    (async () => { res.status(200).send(await directory.getUsers(req)) })();
  });

  app.get("/api/users/:id", checkAuthz('peoplefinder.users.__id.get', 'id'), (req, res) => {
    const id = req.params.id;
    (async () => { res.status(201).send(await directory.getUser(req, id)) })();
  });  

  // edit name and email
  app.put("/api/users/:id", checkAuthz('peoplefinder.users.__id.put', 'id'), (req, res) => {
    const user = req.body;
    const id = req.params.id;
    (async () => { res.status(201).send(await directory.updateUser(req, id, user)) })();
  });  

  // update department and title
  app.post("/api/users/:id", checkAuthz('peoplefinder.users.__id.post', 'id'), (req, res) => {
    const user = req.body;
    const id = req.params.id;
    (async () => { res.status(201).send(await directory.updateUser(req, id, user)) })();
  });  

  app.delete("/api/users/:id", checkAuthz('peoplefinder.users.__id.delete', 'id'), (req, res) => {
    const user = req.body;
    const id = req.params.id;
    (async () => { res.status(201).send(await directory.deleteUser(req, id)) })();
  });  
}
