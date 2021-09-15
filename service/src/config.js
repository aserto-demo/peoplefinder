// workaround: require config-netlify to make sure it gets added to the netlify bundle

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

const policyRoot = process.env.REACT_APP_POLICY_ROOT|| 'peoplefinder';

module.exports = {
  domain: process.env.REACT_APP_DOMAIN,
  audience: process.env.REACT_APP_AUDIENCE,
  port: process.env.API_PORT || 3001,
  appPort,
  appOrigin: process.env.APP_ORIGIN || `http://localhost:${appPort}`,
  authorizerServiceUrl: process.env.AUTHORIZER_SERVICE_URL || `https://authorizer.prod.aserto.com`,
  authorizerApiKey: process.env.AUTHORIZER_API_KEY,
  tenantId: process.env.TENANT_ID,
  policyId: process.env.POLICY_ID,
  authorizerCertFile,
  authorizerCert,
  policyRoot
}
