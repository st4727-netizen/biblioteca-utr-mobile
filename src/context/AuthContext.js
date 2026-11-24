

import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';
import { resetToLogin } from '../navigation/NavigationService';
import { apiFetch, setUnauthorizedHandler } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recuperar sesión guardada
  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await SecureStore.getItemAsync('user_jwt_token');
        const savedUser = await SecureStore.getItemAsync('user_data');

        if (token && savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.log('Error al recuperar sesión:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  // Gestionar sesiones expiradas (HTTP 401)
  useEffect(() => {
    setUnauthorizedHandler(async () => {
        setUser(null);
        resetToLogin();
    });

    return () => {
        setUnauthorizedHandler(null);
    };
  }, []);

  // Iniciar sesión
  const login = async (email, password) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    await SecureStore.setItemAsync('user_jwt_token', data.token);

    const userData = {
      id: data.user.id,
      nombre: data.user.nombre,
      matricula: data.user.matricula,
      rol: data.user.rol,
    };

    await SecureStore.setItemAsync('user_data', JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  // Registrar usuario
  const register = async (nombre, matricula, email, password) => {
    const data = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        nombre,
        matricula,
        email,
        password,
        rol: 'USER',
      }),
    });

    return data;
  };

  // Cerrar sesión
  const logout = async () => {
    await SecureStore.deleteItemAsync('user_jwt_token');
    await SecureStore.deleteItemAsync('user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
