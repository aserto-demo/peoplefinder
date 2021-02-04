let configuration;
if (!process.env.NETLIFY) {
   configuration = require('./auth_config.json');
} else {
  const apiPort = process.env.API_PORT || 3001;
  configuration = {
    "domain": process.env.DOMAIN,
    "clientId": process.env.CLIENT_ID,
    "audience": process.env.AUDIENCE,
    "apiOrigin": `${process.env.SITE_NAME}:${apiPort}`
  };
}

export default configuration;
