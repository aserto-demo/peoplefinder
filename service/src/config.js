// workaround: require config-netlify to make sure it gets added to the netlify bundle
//const netlifyConfig = require('./config-netlify');

// determine which config to load based on the operating environment
/*
const isNetlify = process.env.NETLIFY || process.env.REACT_APP_NETLIFY;
const configSource = isNetlify ? './config-netlify' : './config-local';
const authConfig = require(configSource);
if (!authConfig || !authConfig.domain || !authConfig.audience) {
  throw new Error(
    "Please make sure that auth_config.json is in place and populated"
  );
}
*/

const appPort = process.env.SERVER_PORT || 3000;

// if running against a local authorizer, allow the cert to be provided - either as a file or directly
const fs = require('fs');
const authorizerCertFile = process.env.AUTHORIZER_CERT_FILE;
let authorizerCert = process.env.AUTHORIZER_CERT;
if (!authorizerCert) {
  if (authorizerCertFile) {
    const certfilesplit = authorizerCertFile.split('$HOME/');
    const certfile  = certfilesplit.length > 1 ? `${process.env.HOME}/${certfilesplit[1]}` : authorizerCertFile;
    authorizerCert = fs.readFileSync(certfile);
  }
}

const policyName = process.env.REACT_APP_POLICY_NAME || 'peoplefinder';

module.exports = {
  domain: process.env.REACT_APP_DOMAIN,
  audience: process.env.REACT_APP_AUDIENCE,
  port: process.env.API_PORT || 3001,
  appPort,
  appOrigin: process.env.APP_ORIGIN || `http://localhost:${appPort}`,
  authorizerServiceUrl: process.env.AUTHORIZER_SERVICE_URL || `https://authorizer.eng.aserto.com`,
  authorizerApiKey: process.env.AUTHORIZER_API_KEY,
  tenantId: process.env.TENANT_ID,
  authorizerCertFile,
  authorizerCert,
  policyName
}
