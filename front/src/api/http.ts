import axios from 'axios';

export const http = axios.create({
  baseURL: '/api', // grâce au proxy Vite
  headers: { 'Content-Type': 'application/json' },
});

export function withSso(sso: string) {
  return { headers: { authorization: sso } };
}

export function withApiKey(apiKey: string) {
  return { headers: { authorization: apiKey } };
}
