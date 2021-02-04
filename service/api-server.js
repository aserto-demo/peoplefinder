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
const { port, appOrigin, authorizerServiceUrl, applicationName, domain, audience } = require('./config');

const app = express();

app.use(morgan("dev"));
app.use(helmet());
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
app.use(accessMap({ authorizerServiceUrl, applicationName, useAuthorizationHeader: false }));

// register the api handlers
const users = require('./users-api');
users.register(app);

app.listen(port, () => console.log(`API Server listening on port ${port}`));

// make it work with netlify functions
if (process.env.NETLIFY) {
  module.exports = app;
  module.exports.handler = serverless(app);
}
