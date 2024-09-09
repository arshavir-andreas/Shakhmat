import axios from 'axios';

const apiHost = `localhost:5050`;

const apiURL = `http://${apiHost}/api/v1`;

const fetcher = axios.create({
    baseURL: apiURL,
});

const fetcherIncludingCredentials = axios.create({
    baseURL: apiURL,
    withCredentials: true,
});

export { apiHost, apiURL, fetcher, fetcherIncludingCredentials };
