// auth0 management API utility functions

// exports:
//   getAPIAccessToken(): get access token for API
//   getManagementAPIAccessToken(): get Auth0 management API access token
//   getUser(userId): get a user's Auth0 profile
//   getUsers(): get all users
//   updateUser(userId): update a user's user and app metadata fields

const axios = require('axios');
const { audience, domain, directoryClientId, directoryClientSecret } = require('./config');

// get an API access token
exports.getAPIAccessToken = async () => {
  try {
    const url = `https://${domain}/oauth/token`;
    const headers = { 'content-type': 'application/json' };
    const body = { 
      client_id: directoryClientId,
      client_secret: directoryClientSecret,
      audience: audience,
      grant_type: 'client_credentials'
    };

    const response = await axios.post(
      url,
      body,
      {
        headers: headers
      });
    const data = response.data;
    if (data && data.access_token) {
      return data.access_token;
    }
    return null;
  } catch (error) {
    await error.response;
    console.error(`getAPIAccessToken: caught exception: ${error}`);
    return null;
  }
}

// get a management API access token
exports.getManagementAPIAccessToken = async () => {
  try {
    const url = `https://${domain}/oauth/token`;
    const headers = { 'content-type': 'application/json' };
    const body = { 
      client_id: directoryClientId,
      client_secret: directoryClientSecret,
      audience: `https://${domain}/api/v2/`,
      grant_type: 'client_credentials'
    };

    const response = await axios.post(
      url,
      body,
      {
        headers: headers
      });
    const data = response.data;
    if (data && data.access_token) {
      return data.access_token;
    }
    return null;
  } catch (error) {
    console.error(`getManagementAPIAccessToken: caught exception: ${error}`);
    return null;
  }
}

// get a user's Auth0 profile from the management API
exports.getUser = async (userId) => {
  try {
    const managementToken = await exports.getManagementAPIAccessToken();
    if (!managementToken) {
      console.error('getAuth0Profile: getManagementAPIAccessToken failed');
      return null;
    }
    
    const url = encodeURI(`https://${domain}/api/v2/users/${userId}`);
    const headers = { 
      'content-type': 'application/json',
      'authorization': `Bearer ${managementToken}`
    };

    const response = await axios.get(
      url,
      {
        headers: headers
      });

    return response.data;
  } catch (error) {
    console.error(`getUser: caught exception: ${error}`);
    return null;
  }
}

// get users
exports.getUsers = async () => {
  try {
    const managementToken = await exports.getManagementAPIAccessToken();
    if (!managementToken) {
      console.error('getUsers: getManagementAPIAccessToken failed');
      return null;
    }

    const url = encodeURI(`https://${domain}/api/v2/users?fields=user_id,nickname,email,picture`);
    const headers = { 
      'content-type': 'application/json',
      'authorization': `Bearer ${managementToken}`      
    };

    const response = await axios.get(
      url,
      {
        headers: headers
      });

    return response.data;
  } catch (error) {
    console.error(`getUsers: caught exception: ${error}`);
    return null;
  }  
}

// update a user
exports.updateUser = async (userId, payload) => {
  try {
    const managementToken = await exports.getManagementAPIAccessToken();
    if (!managementToken) {
      console.error('updateUser: getManagementAPIAccessToken failed');
      return null;
    }

    const url = `https://${domain}/api/v2/users/${userId}`;
    const headers = { 
      'content-type': 'application/json',
      'authorization': `Bearer ${managementToken}`      
    };

    // ensure only user and app metadata are updated
    const body = {
      user_metadata: payload.user_metadata, 
      app_metadata: payload.app_metadata
    };

    const response = await axios.patch(
      url,
      body,
      {
        headers: headers
      });

    return response.data;
  } catch (error) {
    console.error(`updateUser: caught exception: ${error}`);
    return null;
  }
}

