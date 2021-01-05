const { jwtAuthz } = require('express-jwt-aserto');
const auth0 = require('./auth0');
const { authorizerServiceUrl, applicationName } = require('./config');

// check authorization by inserting scopes in the array
const checkAuthz = (policy, resource) => jwtAuthz(policy, resource, { authorizerServiceUrl, applicationName });

// register routes for users API
exports.register = (app) => {
  app.get("/api/users", checkAuthz('console.users.get', ''), (req, res) => {
    (async () => { res.status(200).send(await auth0.getUsers()) })();
  });

  app.get("/api/users/:id", checkAuthz('console.users.__id.get', ''), (req, res) => {
    const id = req.params.id;
    (async () => { res.status(201).send(await auth0.getUser(id)) })();
  });  

  app.put("/api/users/:id", checkAuthz('console.users.__id.put', ''), (req, res) => {
    const user = req.body;
    const id = req.params.id;
    (async () => { res.status(201).send(await auth0.updateUser(id, user)) })();
  });  

  app.delete("/api/users/:id", checkAuthz('console.users.__id.delete', ''), (req, res) => {
    const user = req.body;
    const id = req.params.id;
    (async () => { res.status(201).send(await auth0.deleteUser(id)) })();
  });  
}
