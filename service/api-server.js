const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require('body-parser');
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const serverless = require("serverless-http");

// retrieve the authz middleware
const { accessMap } = require("express-jwt-aserto");

// retrieve configuration
const { port, appOrigin, authorizerServiceUrl, applicationName, domain, audience } = require('./src/config');

const app = express();
const router = express.Router();

// set the router's base path corresponding to whether we are hosted in netlify or not
const routerBasePath = process.env.NETLIFY ? '/.netlify/functions/api-server' : '/';

app.use(morgan("dev"));
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors({ origin: appOrigin }));
app.use(bodyParser.json());

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

// use jwt middleware to validate the JWT and extract its claims into the 'user' key
app.use(checkJwt);

// set up middleware to return the access map for this service, passing in authorizer service hostname
//app.use(accessMap({ authorizerServiceUrl, applicationName }));
router.use(accessMap({ authorizerServiceUrl, applicationName, useAuthorizationHeader: false }));

// register the api handlers
const users = require('./src/users-api');
users.register(router);

// configure the router on the correct base path
app.use(routerBasePath, router);

// make it work with netlify functions
if (process.env.NETLIFY) {
  exports.handler = serverless(app);
} else {
  app.listen(port, () => console.log(`API Server listening on port ${port}`));
}
