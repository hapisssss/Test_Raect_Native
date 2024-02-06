import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';


const HomeScreen = ({ navigation }) => {
  const [judulAudit, setJudulAudit] = useState('');
  const [areaAudit, setAreaAudit] = useState(new Date());
  const [tanggalClose, setTanggalClose] = useState(new Date());
  const [showAreaPicker, setShowAreaPicker] = useState(false);
  const [showClosePicker, setShowClosePicker] = useState(false);
  const [userAuditor, setUserAuditor] = useState('');

  useEffect(() => {
    const getUsernameFromStorage = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        setUserAuditor(username || ''); // Menggunakan nilai default kosong jika tidak ada username yang tersimpan
      } catch (error) {
        console.error('Error getting username from AsyncStorage:', error);
      }
    };
    getUsernameFromStorage();
  }); // useEffect hanya akan dijalankan sekali setelah komponen di-mount

  const handleInputAudit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch('http://192.168.71.40:3000/from_audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ "judul": judulAudit, "tanggal_audit": areaAudit, "tanggal_close": tanggalClose, "auditor": userAuditor }),
      });

      if (response.ok) {
        Alert.alert(
          'Audit Input Berhasil',
          'Data audit berhasil disimpan!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Home')
            }
          ],
          { cancelable: false }
        );
      } else {
        console.error('Input audit gagal');
      }
    } catch (error) {
      console.error('Error selama input audit:', error.message);
    }
  };

 

  const onAreaChange = (event, selectedDate) => {
    const currentDate = selectedDate || areaAudit;
    setShowAreaPicker(false);
    setAreaAudit(currentDate);
  };

  const onCloseChange = (event, selectedDate) => {
    const currentDate = selectedDate || tanggalClose;
    setShowClosePicker(false);
    setTanggalClose(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Input Form Audit</Text>

      <TextInput
        style={styles.input}
        placeholder="Judul/Temuan Audit"
        onChangeText={(text) => setJudulAudit(text)}
      />

      <TouchableOpacity style={styles.button} onPress={() => setShowAreaPicker(true)}>
        <Text style={styles.buttonText}>Pilih Tanggal Area Audit</Text>
      </TouchableOpacity>

      {showAreaPicker && (
        <DateTimePicker
          testID="areaPicker"
          value={areaAudit}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onAreaChange}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={() => setShowClosePicker(true)}>
        <Text style={styles.buttonText}>Pilih Tanggal Close</Text>
      </TouchableOpacity>

      {showClosePicker && (
        <DateTimePicker
          testID="closePicker"
          value={tanggalClose}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onCloseChange}
        />
      )}

      <Text style={styles.label}>User Auditor: {userAuditor}</Text>

      <TouchableOpacity style={styles.button} onPress={handleInputAudit}>
        <Text style={styles.buttonText}>Simpan</Text>
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
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  button: {
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
  },
});

export default HomeScreen;




