import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { saveItem } from '../storage';

export default function AddItemScreen({ navigation }) {
  const [serial, setSerial] = useState('');
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [location, setLocation] = useState('');
  const [condition, setCondition] = useState('New'); // default value
  const [notes, setNotes] = useState('');

  async function handleSave() {
    if (!serial) {
      Alert.alert('⚠️ Missing Serial', 'Serial number is required!');
      return;
    }

    const currentDateTime = new Date().toLocaleString();

    const itemData = {
      Name: name,
      Model: model,
      Location: location,
      Condition: condition,
      Time: currentDateTime,
      Notes: notes,
    };

    await saveItem(serial, itemData);

    setSerial('');
    setName('');
    setModel('');
    setLocation('');
    setCondition('New');
    setNotes('');

    Alert.alert('✅ Success', 'Item saved successfully!');
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.title}>➕ Add New Item</Text>

      {/* SERIAL NUMBER CARD */}
      <View style={styles.card}>
        <Text style={styles.label}>Serial Number *</Text>
        <TextInput style={styles.input} value={serial} onChangeText={setSerial} placeholder="Enter Serial Number" />
      </View>

      {/* BASIC INFO CARD */}
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter Item Name" />

        <Text style={styles.label}>Model</Text>
        <TextInput style={styles.input} value={model} onChangeText={setModel} placeholder="Enter Model" />

        <Text style={styles.label}>Location</Text>
        <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Enter Location" />
      </View>

      {/* CONDITION PICKER CARD */}
      <View style={styles.card}>
        <Text style={styles.label}>Condition</Text>
        <Text style={styles.selectedText}>Selected: {condition}</Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={condition}
            onValueChange={(itemValue) => setCondition(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="New" value="New" />
            <Picker.Item label="Used" value="Used" />
            <Picker.Item label="Broken" value="Broken" />
            <Picker.Item label="Refurbished" value="Refurbished" />
          </Picker>
        </View>
      </View>

      {/* NOTES CARD */}
      <View style={styles.card}>
        <Text style={styles.label}>Additional Notes</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add any notes here"
          multiline
        />
      </View>

      {/* ACTION BUTTONS */}
      <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
        <Text style={styles.buttonText}>💾 Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>❌ Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9', padding: 16 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  label: { fontWeight: 'bold', marginTop: 10, fontSize: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    backgroundColor: '#fff',
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: '#fff',
  },
  picker: { height: 30, backgroundColor: '#eee' },
  selectedText: { fontSize: 14, color: 'gray', marginBottom: 4 },

  button: {
    padding: 14,
    borderRadius: 10,
    marginVertical: 6,
    alignItems: 'center',
  },
  saveButton: { backgroundColor: '#4CAF50' },
  cancelButton: { backgroundColor: '#757575' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
