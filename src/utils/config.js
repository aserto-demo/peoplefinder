let configuration;
if (!process.env.REACT_APP_NETLIFY) {
  configuration = require('./auth_config.json');
  if (!configuration.apiOrigin) {
    const url = new URL(window.location.origin);
    if (url.port === '3000') {
      url.port = '3001';
    }
    const urlstring = url + '';
    configuration.apiOrigin = 
      urlstring.substr(-1) === '/' ? 
      urlstring.substr(0, urlstring.length - 1) : 
      urlstring;
  }
} else {
  configuration = {
    "domain": process.env.REACT_APP_DOMAIN,
    "clientId": process.env.REACT_APP_CLIENT_ID,
    "audience": process.env.REACT_APP_AUDIENCE,
    "authorizerServiceUrl": process.env.REACT_APP_AUTHORIZER_SERVICE_URL,
    "apiOrigin": `${window.location.origin}/.netlify/functions/api-server`
  };
}

export default configuration;
