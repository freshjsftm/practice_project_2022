import axios from 'axios';
import CONTANTS from '../constants';
import history from '../browserHistory';

const httpClient = axios.create({
  baseURL: CONTANTS.BASE_URL,
});

let accessToken = null;

httpClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = { ...config.headers, Authorization: `Bearer ${accessToken}` };
  }
  return config;
}, (err) => Promise.reject(err));

httpClient.interceptors.response.use((response) => {
  if (response && response.data && response.data.data && response.data.data.tokenPair) {
    const { data: {data: { tokenPair: {access, refresh} } } } = response;
    window.localStorage.setItem(CONTANTS.REFRESH_TOKEN, refresh);
    accessToken = access;
  }
  return response;
}, (err) => {
  const refreshToken = window.localStorage.getItem(CONTANTS.REFRESH_TOKEN);
  if(err.response.status===419 && refreshToken){
    const { data: {data: { tokenPair: {access, refresh} } } } = httpClient.post('auth/refresh', {refreshToken});
    window.localStorage.setItem(CONTANTS.REFRESH_TOKEN, refresh);
    accessToken = access;
    err.config.headers.Authorization = `Bearer ${accessToken}`;
    return axios.request(err.config);
  }
  return Promise.reject(err);
});

export default httpClient;
