import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { saveItem, deleteItem } from '../storage';
import { Picker } from '@react-native-picker/picker';

const normalizeCondition = (value) => {
  if (!value) return 'New';
  const cleanValue = value.trim().toLowerCase();
  if (cleanValue === 'new') return 'New';
  if (cleanValue === 'used') return 'Used';
  if (cleanValue === 'broken') return 'Broken';
  if (cleanValue === 'refurbished') return 'Refurbished';
  return 'New';
};

export default function EditItemScreen({ route, navigation }) {
  const { serial, data } = route.params;

  const [name, setName] = useState(data.Name || '');
  const [model, setModel] = useState(data.Model || '');
  const [location, setLocation] = useState(data.Location || '');
  const [condition, setCondition] = useState(normalizeCondition(data.Condition));
  const [time, setTime] = useState(data.Time || '');
  const [notes, setNotes] = useState(data.Notes || '');

  async function handleSave() {
    const updatedItem = {
      Name: name,
      Model: model,
      Location: location,
      Condition: condition,
      Time: time,
      Notes: notes,
    };
    await saveItem(serial, updatedItem);
    navigation.goBack();
  }

  function confirmDelete() {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${serial}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteItem(serial);
            navigation.goBack();
          }
        }
      ]
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.title}>✏️ Edit Item</Text>

      {/* SERIAL NUMBER CARD */}
      <View style={styles.card}>
        <Text style={styles.label}>Serial Number</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#eee' }]}
          value={serial}
          editable={false}
        />
      </View>

      {/* NAME CARD */}
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Model</Text>
        <TextInput style={styles.input} value={model} onChangeText={setModel} />

        <Text style={styles.label}>Location</Text>
        <TextInput style={styles.input} value={location} onChangeText={setLocation} />
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

      {/* TIME & NOTES CARD */}
      <View style={styles.card}>
        <Text style={styles.label}>Time</Text>
        <TextInput
          style={styles.input}
          value={time}
          onChangeText={setTime}
          placeholder="e.g. 2025-07-31"
        />

        <Text style={styles.label}>Additional Notes</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>

      {/* ACTION BUTTONS */}
      <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
        <Text style={styles.buttonText}>💾 Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={confirmDelete}>
        <Text style={styles.buttonText}>🗑 Delete Item</Text>
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
    backgroundColor: '#fff'
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: '#fff'
  },
  picker: { height: 30, backgroundColor: '#eee' },
  selectedText: { fontSize: 14, color: 'gray', marginBottom: 4 },
  button: {
    padding: 14,
    borderRadius: 10,
    marginVertical: 6,
    alignItems: 'center'
  },
  saveButton: { backgroundColor: '#4CAF50' },
  deleteButton: { backgroundColor: '#E53935' },
  cancelButton: { backgroundColor: '#757575' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
