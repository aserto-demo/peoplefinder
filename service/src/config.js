// workaround: require config-netlify to make sure it gets added to the netlify bundle
const netlifyConfig = require('./config-netlify');

// determine which config to load based on the operating environment
const isNetlify = process.env.NETLIFY || process.env.REACT_APP_NETLIFY;
const configSource = isNetlify ? './config-netlify' : './config-local';
const authConfig = require(configSource);

if (!authConfig || !authConfig.domain || !authConfig.audience) {
  throw new Error(
    "Please make sure that auth_config.json is in place and populated"
  );
}

const fs = require('fs');

const domain = authConfig.domain;
const audience = authConfig.audience;
const port = process.env.API_PORT || 3001;
const appPort = process.env.SERVER_PORT || 3000;
const appOrigin = authConfig.appOrigin || `http://localhost:${appPort}`;
const authorizerServiceUrl = authConfig.authorizerServiceUrl || 'https://localhost:8383';

const authorizerCertFile = authConfig.authorizerCertFile || '$HOME/.config/aserto/aserto-one/certs/aserto-one-gateway-ca.crt';
const certfilesplit = authorizerCertFile.split('$HOME/');
const certfile  = certfilesplit.length > 1 ? `${process.env.HOME}/${certfilesplit[1]}` : authorizerCertFile;
const authorizerCert = authConfig.authorizerCert || fs.readFileSync(certfile);

const applicationName = authConfig.applicationName || 'peoplefinder';
const directoryClientId = authConfig.directoryClientId;
const directoryClientSecret = authConfig.directoryClientSecret;

module.exports = {
  domain,
  audience,
  port,
  appPort,
  appOrigin,
  authorizerServiceUrl,
  authorizerCert,
  applicationName,
  directoryClientId,
  directoryClientSecret
};
