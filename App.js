
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Login">
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
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
