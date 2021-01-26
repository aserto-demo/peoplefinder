// directory management API utility functions

// exports:
//   getUser(userId): get a user's profile
//   getUsers(): get all users
//   updateUser(userId): update a user's user and app metadata fields

const { authorizerServiceUrl, authorizerCert } = require('./config');

// create a well-configured axios client initialized with the correct authrorizer certificate
const https = require('https');
const axios = require('axios').create({
  httpsAgent: new https.Agent({
    ca: authorizerCert
  })
});

// get a user's Auth0 profile from the management API
exports.getUser = async (req, user) => {
  try {
    const url = `${authorizerServiceUrl}/api/v1/dir/users/${user}`;
    const headers = { 
      'content-type': 'application/json',
      'authorization': `Bearer ${req.headers.authorization}`
    };

    const response = await axios.get(
      url,
      {
        headers: headers
      });

    const result = response.data && response.data.results && response.data.results[user];
    return result;
  } catch (error) {
    console.error(`getUser: caught exception: ${error}`);
    return null;
  }
}

// get users
exports.getUsers = async (req) => {
  try {
    const url = `${authorizerServiceUrl}/api/v1/dir/users`;
    const headers = { 
      'content-type': 'application/json',
      'authorization': `Bearer ${req.headers.authorization}`
    };

    const response = await axios.get(
      url,
      {
        headers: headers
      });

    const result = response.data && response.data.results && 
      Object.values(response.data.results);
    return result;
  } catch (error) {
    console.error(`getUsers: caught exception: ${error}`);
    return null;
  }  
}

// update a user
exports.updateUser = async (req, user, payload) => {
  try {
    const url = `${authorizerServiceUrl}/api/v1/dir/users/${user}`;
    const headers = { 
      'content-type': 'application/json',
      'authorization': `Bearer ${req.headers.authorization}`
    };

    const response = await axios.put(
      url,
      payload,
      {
        headers: headers
      });

    const result = response.data && response.data.results && response.data.results[user];
    return result;
  } catch (error) {
    console.error(`updateUser: caught exception: ${error}`);
    return null;
  }
}
