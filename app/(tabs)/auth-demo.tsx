import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { getAuthTeams, getFavorites } from '../../utils/SimpleApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthDemo() {
  const [data, setData] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user has a token
    AsyncStorage.getItem('accessToken').then(token => {
      setToken(token);
    });
  }, []);

  const testAuthEndpoint = async () => {
    if (!token) {
      Alert.alert('No Token', 'Please login first to test authenticated endpoints');
      return;
    }

    setLoading(true);
    setData('Loading authenticated data...');

    try {
      // Try to get authenticated teams
      const teams = await getAuthTeams(token);
      
      if (teams) {
        setData(`✅ Auth Success!\nGot ${teams.length} teams from /api/teams\n\nFirst 3 teams:\n${JSON.stringify(teams.slice(0, 3), null, 2)}`);
      } else {
        setData('❌ Auth Failed - Token might be invalid or expired');
      }
    } catch (error) {
      setData(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setLoading(false);
  };

  const testFavorites = async () => {
    if (!token) {
      Alert.alert('No Token', 'Please login first');
      return;
    }

    setLoading(true);
    setData('Loading favorites...');

    try {
      const favorites = await getFavorites(token);
      
      if (favorites) {
        setData(`✅ Favorites loaded!\nCount: ${favorites.length}\n\nData:\n${JSON.stringify(favorites, null, 2)}`);
      } else {
        setData('❌ Failed to load favorites');
      }
    } catch (error) {
      setData(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setLoading(false);
  };

  const addTestFavorite = async () => {
    if (!token) {
      Alert.alert('No Token', 'Please login first');
      return;
    }

    setLoading(true);
    setData('Adding test favorite...');

    try {
      // Note: addFavorite function not implemented in SimpleApi
      setData('❌ AddFavorite function not available in current API');
    } catch (error) {
      setData(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authenticated API Demo</Text>
      
      <View style={styles.status}>
        <Text>Token Status: {token ? '✅ Available' : '❌ None (Login first)'}</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity 
          style={[styles.button, !token && styles.buttonDisabled]} 
          onPress={testAuthEndpoint}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test /api/teams</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, !token && styles.buttonDisabled]} 
          onPress={testFavorites}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test /api/favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, !token && styles.buttonDisabled]} 
          onPress={addTestFavorite}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Add Test Favorite</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.output}>
        <Text style={styles.outputText}>
          {loading ? 'Loading...' : data || 'Click a button to test authenticated endpoints'}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  status: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttons: {
    gap: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  output: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
  },
  outputText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
});