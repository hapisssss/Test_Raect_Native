import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const navigation = useNavigation();

  const navigateToFromAudit = () => {
    navigation.navigate('FromAudit');
  };

  const navigateToShowAudit = () => {
    navigation.navigate('ShowAudit');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home</Text>

      <TouchableOpacity style={styles.button} onPress={navigateToFromAudit}>
        <Icon name="create" size={20} color="#fff" />
        <Text style={styles.buttonText}> From Audit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={navigateToShowAudit}>
        <Icon name="list" size={20} color="#fff" />
        <Text style={styles.buttonText}> Show Audit</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.button} onPress={handleLogout}>
         <Text style={styles.buttonText}>Logout</Text>
       </TouchableOpacity>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3498db',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row', 
    backgroundColor: '#2980b9',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: 10, 
  },
});

export default HomeScreen;
