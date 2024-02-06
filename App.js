import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import LoginScreen from './Login';
import HomeScreen from './Home';
import Registration from './Registration';
import ForgotPassword from './ForgotPassword';
import FromAudit from './FromAudit';
import ShowAudit from './ShowAudit';
import EditAudit from './EditAudit';

const Stack = createNativeStackNavigator();

const App = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error getting token:', error);
      } finally {
        setLoading(false);
      }
    };

    getToken();
  }, []);

  if (loading) {
    return <></>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={Registration} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="FromAudit" component={FromAudit} />
            <Stack.Screen name="ShowAudit" component={ShowAudit} />
            <Stack.Screen name="EditAudit" component={EditAudit} />
            
            
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={Registration} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="FromAudit" component={FromAudit} />
            <Stack.Screen name="ShowAudit" component={ShowAudit} />
            <Stack.Screen name="EditAudit" component={EditAudit} />

            
          </>
        )}

          
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;