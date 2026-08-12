import { Platform } from 'react-native';

let SecureStore;
try {
  SecureStore = require('expo-secure-store');
} catch {}

const webStorage = {};

export async function getItem(key) {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  if (!SecureStore) return null;
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

export async function setItem(key, value) {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  if (!SecureStore) return;
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {}
}

export async function deleteItem(key) {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
    return;
  }
  if (!SecureStore) return;
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {}
}
