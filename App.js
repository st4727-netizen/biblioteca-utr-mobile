
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { navigationRef } from './src/navigation/NavigationService';

import CatalogScreen from './src/screens/CatalogScreen';
import LoanRequestScreen from './src/screens/LoanRequestScreen';
import LoginScreen from './src/screens/LoginScreen';
import MyLoansScreen from './src/screens/MyLoansScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#073DA8" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        key={user ? 'authenticated' : 'guest'}
        initialRouteName={user ? 'Catalog' : 'Login'}
      >
        {!user ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                title: 'Crear cuenta',
                headerTintColor: '#17365D',
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Catalog"
              component={CatalogScreen}
              options={{
                title: 'Biblioteca UTR',
                headerTintColor: '#17365D',
                headerStyle: { backgroundColor: '#FFFFFF' },
              }}
            />
            <Stack.Screen
              name="LoanRequest"
              component={LoanRequestScreen}
              options={{
                title: 'Solicitud de préstamo',
                headerTintColor: '#17365D',
                headerStyle: { backgroundColor: '#FFFFFF' },
              }}
            />
            <Stack.Screen
              name="MyLoans"
              component={MyLoansScreen}
              options={{
                title: 'Mis préstamos',
                headerTintColor: '#17365D',
                headerStyle: { backgroundColor: '#FFFFFF' },
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});


