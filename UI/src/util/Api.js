import axios from 'axios';
const APIEndpoint = "https://us-central1-socialpanel-1ecb9.cloudfunctions.net/app/api/v1"; 

const api = axios.create({
  baseURL: APIEndpoint,
  headers: {
    'Content-Type': 'application/json'
  }
});

const handleError = (error) => {
  if (error.response) {
    console.error('Server-side error:', error.response.data);
    const errorMessage = error.response.data.message || 'Something went wrong.';
    const statusCode = error.response.status || 500;
    if (statusCode === 500) {
      if (error.response.data.error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        return Promise.reject('Invalid value for a field.');
      }
    }
    return Promise.reject(errorMessage);
  } else if (error.request) {
    console.error('No response received:', error.request);
    return Promise.reject('No response received from server.');
  } else {
    console.error('Request failed to set up:', error.message);
    return Promise.reject('Request failed to set up.');
  }
};

const apiService = {
  get: (endpoint, params) => {
    return api.get(endpoint, { params })
      .then(response => response.data)
      .catch(handleError);
  },
  post: (endpoint, data) => {
    return api.post(endpoint, data)
      .then(response => response.data)
      .catch(handleError);
  },
  put: (endpoint, data) => {
    return api.put(endpoint, data)
      .then(response => response.data)
      .catch(handleError);
  },
  patch: (endpoint, data) => {
    return api.patch(endpoint, data)
      .then(response => response.data)
      .catch(handleError);
  },
  delete: (endpoint) => {
    return api.delete(endpoint)
      .then(response => response.data)
      .catch(handleError);
  }
};

export default apiService;
