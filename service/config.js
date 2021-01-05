const authConfig = require("../src/utils/auth_config.json");

if (!authConfig || !authConfig.domain || !authConfig.audience || !authConfig.authorizerServiceUrl) {
  throw new Error(
    "Please make sure that auth_config.json is in place and populated"
  );
}

const domain = authConfig.domain;
const audience = authConfig.audience;
const port = process.env.API_PORT || 3001;
const appPort = process.env.SERVER_PORT || 3000;
const appOrigin = authConfig.appOrigin || `http://localhost:${appPort}`;
const authorizerServiceUrl = authConfig.authorizerServiceUrl || 'https://localhost:8383';
const applicationName = authConfig.applicationName || 'console';
const directoryClientId = authConfig.directoryClientId;
const directoryClientSecret = authConfig.directoryClientSecret;

module.exports = {
  domain,
  audience,
  port,
  appPort,
  appOrigin,
  authorizerServiceUrl,
  applicationName,
  directoryClientId,
  directoryClientSecret
};
