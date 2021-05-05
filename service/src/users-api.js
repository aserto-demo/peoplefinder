const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { displayStateMap, jwtAuthz, is } = require('express-jwt-aserto');
const directory = require('./directory');
const { 
  authorizerServiceUrl, 
  authorizerApiKey,
  tenantId,
  policyId,
  authorizerCertFile, 
  policyRoot, 
  audience, 
  domain 
} = require('./config');

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`
  }),

  audience: audience,
  issuer: `https://${domain}/`,
  algorithms: ["RS256"]
});

const authzOptions = { 
  authorizerServiceUrl, 
  policyId,
  policyRoot, 
  useAuthorizationHeader: false 
};
if (authorizerApiKey) {
  authzOptions.authorizerApiKey = authorizerApiKey;
}
if (tenantId) {
  authzOptions.tenantId = tenantId;
}
if (authorizerCertFile) {
  authzOptions.authorizerCertFile = authorizerCertFile;
}

// check authorization by initializing the jwtAuthz middleware with option map
const checkAuthz = jwtAuthz(authzOptions);

// register routes for users API
exports.register = (app) => {
  // set up middleware to return the display state map for this service
  app.use(displayStateMap(authzOptions));

  // use checkAuthz as middleware in the route dispatch path
  app.get("/api/users", checkJwt, checkAuthz, async (req, res) => {
    const users = await directory.getUsers(req);
    if (users) {
      res.status(200).send(users);
    } else {
      res.status(403).send('something went wrong');
    }
  });

  app.get("/api/users/:id", checkJwt, checkAuthz, async (req, res) => {
    const id = req.params.id;
    const user = await directory.getUser(req, id);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(403).send('something went wrong');
    }
  });  

  // edit name and email
  app.put("/api/users/:id", checkJwt, checkAuthz, async (req, res) => {
    const user = req.body;
    const id = req.params.id;
    const response = await directory.updateUser(req, id, user);
    if (response) {
      res.status(201).send(response);
    } else {
      res.status(403).send('something went wrong');
    }
  });  

  // update department and title
  app.post("/api/users/:id", checkJwt, checkAuthz, async (req, res) => {
    const user = req.body;
    const id = req.params.id;
    const response = await directory.updateUser(req, id, user);
    if (response) {
      res.status(201).send(response);
    } else {
      res.status(403).send('something went wrong');
    }
  });  

  // delete the user
  // instead of checkAuthz, use the "is" function for a more imperative style of authorization
  app.delete("/api/users/:id", checkJwt, /* checkAuthz,*/ async (req, res) => {
    const id = req.params.id;

    try {
      // call the is('allowed') method, inferring the policy name and resource
      const allowed = await is('allowed', req, authzOptions);
      if (allowed) {
        const response = await directory.deleteUser(req, id);
        if (response) {
          res.status(201).send(response);
        } else {
          res.status(403).send('something went wrong');
        }
      } else {
        res.status(403).send('Not Authorized');
      }
    }
    catch (error) {
      res.status(403).send(`Not Authorized: exception ${error.message}`);            
    }
  });  
}
