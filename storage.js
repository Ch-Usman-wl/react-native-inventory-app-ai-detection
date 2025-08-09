import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'ITEM_LIST';

export async function getItems() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

export async function saveItem(serial, data) {
  const list = await getItems();
  list[serial] = data;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export async function deleteItem(serial) {
  const list = await getItems();
  delete list[serial];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
