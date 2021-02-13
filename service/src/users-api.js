const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { displayStateMap, jwtAuthz, is } = require('express-jwt-aserto');
const directory = require('./directory');
const { authorizerServiceUrl, authorizerCertFile, applicationName, audience, domain } = require('./config');

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
  applicationName, 
  useAuthorizationHeader: false 
};
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
  app.get("/api/users", checkJwt, checkAuthz, (req, res) => {
    (async () => { res.status(200).send(await directory.getUsers(req)) })();
  });

  app.get("/api/users/:id", checkJwt, checkAuthz, (req, res) => {
    const id = req.params.id;
    (async () => { res.status(200).send(await directory.getUser(req, id)) })();
  });  

  // edit name and email
  app.put("/api/users/:id", checkJwt, checkAuthz, (req, res) => {
    const user = req.body;
    const id = req.params.id;
    (async () => { res.status(201).send(await directory.updateUser(req, id, user)) })();
  });  

  // update department and title
  app.post("/api/users/:id", checkJwt, checkAuthz, (req, res) => {
    const user = req.body;
    const id = req.params.id;
    (async () => { res.status(201).send(await directory.updateUser(req, id, user)) })();
  });  

  // delete the user
  // instead of checkAuthz, use the "is" function for a more imperative style of authorization
  app.delete("/api/users/:id", checkJwt, /* checkAuthz,*/ (req, res) => {
    const id = req.params.id;

    const check = async () => {
      try {
        // call the is('allowed') method, inferring the policy name and resource
        const allowed = await is('allowed', req, authzOptions);
        if (allowed) {
          res.status(201).send(await directory.deleteUser(req, id));
        } else {
          res.status(403).send('Not Authorized');
        }
      }
      catch (error) {
        res.status(403).send(`Not Authorized: exception ${error.message}`);            
      }
    }

    // invoke the async function
    check();
  });  
}
