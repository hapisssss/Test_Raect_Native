import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; 

const ShowAudit = ({ navigation }) => {
  const [auditList, setAuditList] = useState([]);

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const username = await AsyncStorage.getItem('username');
        
        const response = await fetch('http://192.168.71.40:3000/from_audit?auditor='+username,{
          method: 'GET',
          headers: {
            'Authorization': token,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          
          // Simpan ID ke AsyncStorage
          const auditIds = data.map(audit => audit.id);
          await AsyncStorage.setItem('auditIds', JSON.stringify(auditIds));
          
          setAuditList(data);
        } else {
          console.error('Error fetching audit data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching audit data:', error);
      }
    };
  
    fetchAuditData();
  }, []);
  

  const handleEditAudit = (item) => {
    // Navigasi ke halaman EditAudit dan kirim data audit yang akan diedit
    navigation.navigate('EditAudit', { audit: item });
  };

  const renderAuditItem = ({ item }) => (
    <View style={styles.auditItem}>
      <View>
        <Text style={styles.auditTitle}>{item.judul}</Text>
        <Text style={styles.auditDetail}>Tanggal Audit: {item.tanggal_audit}</Text>
        <Text style={styles.auditDetail}>Tanggal Close: {item.tanggal_close}</Text>
        <Text style={styles.auditDetail}>Auditor: {item.auditor}</Text>
      </View>

      {/* Tombol edit */}
      <TouchableOpacity onPress={() => handleEditAudit(item)}>
        <Ionicons name="pencil" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daftar Audit</Text>

      <FlatList
        data={auditList}
        renderItem={renderAuditItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.auditList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2980b9',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003366', 
  },
  auditList: {
    flex: 1,
  },
  auditItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  auditTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  auditDetail: {
    fontSize: 16,
    color: 'white',
  },
});

export default ShowAudit;
