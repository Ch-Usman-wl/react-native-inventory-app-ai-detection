import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { deleteItem, getItems } from '../storage';

export default function DetailsScreen({ route, navigation }) {
  const { serial, data } = route.params;

  // ✅ State to hold the most up-to-date item
  const [item, setItem] = useState(data);

  // ✅ Refresh item data every time this screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const items = await getItems();
      if (items[serial]) {
        setItem(items[serial]); // 🔄 Update the item with the latest data
      }
    });

    return unsubscribe; // ✅ cleanup listener
  }, [navigation, serial]);

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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📄 Item Details</Text>

      {/* 🔹 Info Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Serial Number</Text>
        <Text style={styles.value}>{serial}</Text>

        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{item?.Name || '-'}</Text>

        <Text style={styles.label}>Model</Text>
        <Text style={styles.value}>{item?.Model || '-'}</Text>

        <Text style={styles.label}>Location</Text>
        <Text style={styles.value}>{item?.Location || '-'}</Text>

        <Text style={styles.label}>Condition</Text>
        <Text style={styles.value}>{item?.Condition || '-'}</Text>

        <Text style={styles.label}>Time Added</Text>
        <Text style={styles.value}>{item?.Time || '-'}</Text>

        <Text style={styles.label}>Notes</Text>
        <Text style={styles.value}>{item?.Notes || '-'}</Text>
      </View>

      {/* 🔹 Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('EditItem', { serial, data: item })}
        >
          <Text style={styles.buttonText}>✏️ Edit Item</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={confirmDelete}
        >
          <Text style={styles.buttonText}>🗑 Delete Item</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#f0f4f8' 
  },

  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#222' 
  },

  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 20,
    elevation: 3, 
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  label: { 
    fontSize: 15, 
    fontWeight: '600', 
    marginTop: 12, 
    color: '#555' 
  },

  value: { 
    fontSize: 16, 
    marginTop: 4, 
    color: '#333', 
    backgroundColor: '#f8f9fa', 
    padding: 8, 
    borderRadius: 8 
  },

  buttonContainer: {
    marginTop: 10,
  },

  actionButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2
  },

  editButton: {
    backgroundColor: '#007BFF'
  },

  deleteButton: {
    backgroundColor: '#dc3545'
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
