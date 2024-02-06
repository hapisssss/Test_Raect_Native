import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditAudit = ({ route, navigation }) => {
  const { audit } = route.params;
  const [judul, setJudul] = useState(audit.judul);
  const [tanggalAudit, setTanggalAudit] = useState(audit.tanggal_audit);
  const [tanggalClose, setTanggalClose] = useState(audit.tanggal_close);

  const handleUpdateAudit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`http://192.168.71.40:3000/from_audit?id=${audit.id}`, {
        method: 'PUT',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "judul": judul, "tanggal_audit": tanggalAudit, "tanggal_close": tanggalClose }),
      });

      if (response.ok) {
        // Tampilkan pop-up dengan pesan berhasil
        Alert.alert(
          'Sukses',
          'Audit berhasil diperbarui',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigasikan pengguna kembali ke halaman Home
                navigation.navigate('Home');
              }
            }
          ]
        );
      } else {
        console.error('Gagal memperbarui audit');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Audit</Text>
      <TextInput
        style={styles.input}
        placeholder="Judul"
        value={judul}
        onChangeText={setJudul}
      />
      <TextInput
        style={styles.input}
        placeholder="Tanggal Audit"
        value={tanggalAudit}
        onChangeText={setTanggalAudit}
      />
      <TextInput
        style={styles.input}
        placeholder="Tanggal Close"
        value={tanggalClose}
        onChangeText={setTanggalClose}
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdateAudit}>
        <Text style={styles.buttonText}>Simpan Perubahan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2980b9', // Ubah warna latar belakang menjadi biru
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black', // Ubah warna teks menjadi putih
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#fff', // Ubah warna garis tepi menjadi putih
    borderRadius: 8,
    marginBottom: 20,
    padding: 10,
    color: 'white', // Ubah warna teks input menjadi putih
  },
  button: {
    backgroundColor: '#fff', // Ubah warna tombol menjadi putih
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#2980b9', // Ubah warna teks tombol menjadi biru
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default EditAudit;
