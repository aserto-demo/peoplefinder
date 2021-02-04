let configuration;
if (!process.env.REACT_APP_NETLIFY) {
   configuration = require('./auth_config.json');
} else {
  configuration = {
    "domain": process.env.REACT_APP_DOMAIN,
    "clientId": process.env.REACT_APP_CLIENT_ID,
    "audience": process.env.REACT_APP_AUDIENCE,
    "apiOrigin": process.env.REACT_APP_API_ORIGIN
  };
}

export default configuration;
