
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const APP_TOKEN = process.env.EXPO_PUBLIC_API_APP_TOKEN;

let unauthorizedHandler = null;

// Permite que AuthContext gestione una sesión expirada
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export async function apiFetch(endpoint, options = {}) {
  if (!API_URL) {
    throw new Error('No se ha configurado EXPO_PUBLIC_API_URL.');
  }

  if (!APP_TOKEN || APP_TOKEN === 'your_app_token_here') {
    throw new Error('No se ha configurado EXPO_PUBLIC_API_APP_TOKEN.');
  }

  const userToken = await SecureStore.getItemAsync('user_jwt_token');

  const headers = {
    'Content-Type': 'application/json',
    'x-api-token': APP_TOKEN,
    ...(userToken && {
      Authorization: `Bearer ${userToken}`,
    }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    await SecureStore.deleteItemAsync('user_jwt_token');
    await SecureStore.deleteItemAsync('user_data');

    if (unauthorizedHandler) {
      await unauthorizedHandler();
    }

    throw new Error('Sesión expirada. Inicia sesión nuevamente.');
  }

  if (response.status === 403) {
    throw new Error('No tienes permisos para realizar esta acción.');
  }

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      responseData?.message ||
      `Error del servidor: ${response.status}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return responseData;
}

