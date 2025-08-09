import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getItems } from '../storage';

export default function SearchScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState({});
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadItems);
    return unsubscribe;
  }, [navigation]);

  async function loadItems() {
    const data = await getItems();
    setItems(data);
    setFiltered(Object.entries(data));
  }

  function handleSearch(text) {
    setSearch(text);
    if (text === '') {
      setFiltered(Object.entries(items));
    } else {
      setFiltered(
        Object.entries(items).filter(([serial]) =>
          serial.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  }

  // 🔍 Manual search button press (in case user types & presses button)
  function onSearchPress() {
    handleSearch(search);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Search Items</Text>

      {/* Search Bar with Search Button */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Enter Serial Number..."
          value={search}
          onChangeText={handleSearch}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.searchButton} onPress={onSearchPress}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* List of Items */}
      <FlatList
        data={filtered}
        keyExtractor={([serial]) => serial}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => {
          const [serial, data] = item;
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.serial}>{serial}</Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.info}>📦 <Text style={styles.infoLabel}>Name:</Text> {data.Name || '-'}</Text>
                <Text style={styles.info}>🛠 <Text style={styles.infoLabel}>Model:</Text> {data.Model || '-'}</Text>
                <Text style={styles.info}>📍 <Text style={styles.infoLabel}>Location:</Text> {data.Location || '-'}</Text>
              </View>

              {/* View Details Button */}
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => navigation.navigate('Details', { serial, data })}
              >
                <Text style={styles.detailsButtonText}>📄 View Details</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#f0f4f8' 
  },

  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    marginBottom: 16, 
    color: '#222' 
  },

  searchRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center'
  },

  input: { 
    flex: 1,
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 12, 
    padding: 12, 
    backgroundColor: '#fff', 
    fontSize: 16,
    marginRight: 8
  },

  searchButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
  },

  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginVertical: 8,
    elevation: 3, // subtle shadow on Android
    shadowColor: '#000', // shadow on iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 6,
    marginBottom: 8
  },

  serial: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2c3e50'
  },

  cardBody: {
    marginBottom: 10
  },

  info: {
    fontSize: 15,
    marginBottom: 4,
    color: '#333'
  },

  infoLabel: {
    fontWeight: '600',
    color: '#555'
  },

  detailsButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center'
  },

  detailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15
  }
});
