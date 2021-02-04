let configuration;
if (process.env.HOST_ENV !== 'NETLIFY') {
   configuration = require('./auth_config.json');
} else {
  configuration = {
    "domain": process.env.DOMAIN,
    "clientId": process.env.CLIENT_ID,
    "audience": process.env.AUDIENCE,
    "apiOrigin": process.env.API_ORIGIN
  }
}

export default configuration;

