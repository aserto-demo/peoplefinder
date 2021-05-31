// directory management API utility functions

// exports:
//   getUser(userId): get a user's profile
//   getUsers(): get all users
//   updateUser(userId): update a user's user and app metadata fields

const { authorizerServiceUrl, authorizerCert, tenantId, authorizerApiKey } = require('./config');

// create a well-configured axios client initialized with the correct authrorizer certificate
const https = require('https');
const axios = authorizerCert ? 
  require('axios').create({
    httpsAgent: new https.Agent({
      ca: authorizerCert
    })
  }) :
  require('axios');

// get a user's profile from the management API
exports.getUser = async (req, user) => {
  try {
    const url = `${authorizerServiceUrl}/api/v1/dir/users/${user}`;
    const headers = { 
      'content-type': 'application/json',
    };
    if (tenantId) {
      headers['aserto-tenant-id'] = tenantId;
    }
    if (authorizerApiKey) {
      headers['authorization'] = `basic ${authorizerApiKey}`;
    }

    const response = await axios.get(
      url,
      {
        headers: headers
      });

    const result = response.data && response.data.result;
    return result;
  } catch (error) {
    console.error(`getUser: caught exception: ${error}`);
    return null;
  }
}

// get users
exports.getUsers = async (req) => {
  try {
    const url = `${authorizerServiceUrl}/api/v1/dir/users?page.size=-1&fields.mask=id,display_name,picture,email`;
    const headers = { 
      'content-type': 'application/json',
    };
    if (tenantId) {
      headers['aserto-tenant-id'] = tenantId;
    }
    if (authorizerApiKey) {
      headers['authorization'] = `basic ${authorizerApiKey}`;
    }

    const response = await axios.get(
      url,
      {
        headers: headers
      });

    const result = response.data && response.data.results;
    return result;
  } catch (error) {
    console.error(`getUsers: caught exception: ${error}`);
    return null;
  }  
}

// update a user
exports.updateUser = async (req, user, payload) => {
  try {
    const url = `${authorizerServiceUrl}/api/v1/dir/users/${user}/attributes/properties`;
    const headers = { 
      'content-type': 'application/json',
    };
    if (tenantId) {
      headers['aserto-tenant-id'] = tenantId;
    }
    if (authorizerApiKey) {
      headers['authorization'] = `basic ${authorizerApiKey}`;
    }

    const response = await axios.post(
      url,
      JSON.stringify(payload),
      {
        headers: headers
      });

    const result = response.data;
    return result;
  } catch (error) {
    console.error(`updateUser: caught exception: ${error}`);
    return null;
  }
}

// delete a user
exports.deleteUser = async (req, user) => {
  // not implemented
  return null;
}
