import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { getTeams, getGames, getAuthTeams, getAuthGames } from '../../utils/SimpleApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ApiComparison = () => {
  const [publicData, setPublicData] = useState(null);
  const [authData, setAuthData] = useState(null);
  const [status, setStatus] = useState('Ready');

  // Test public endpoints
  const testPublic = async () => {
    setStatus('Loading public data...');
    const teams = await getTeams();
    const games = await getGames();
    setPublicData({ teams: teams?.slice(0, 3), games: games?.slice(0, 3) });
    setStatus('Public data loaded');
  };

  // Test authenticated endpoints
  const testAuth = async () => {
    setStatus('Loading auth data...');
    const token = await AsyncStorage.getItem('accessToken');
    
    if (!token) {
      setStatus('No token - login first');
      return;
    }

    const teams = await getAuthTeams(token);
    const games = await getAuthGames(token);
    
    if (teams || games) {
      setAuthData({ teams: teams?.slice(0, 3), games: games?.slice(0, 3) });
      setStatus('Auth data loaded');
    } else {
      setStatus('Auth failed - token invalid?');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Endpoint Comparison</Text>
      <Text>Status: {status}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={testPublic}>
          <Text>Test Public (/teams, /games)</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={testAuth}>
          <Text>Test Auth (/api/teams, /api/games)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dataContainer}>
        <View style={styles.dataColumn}>
          <Text style={styles.dataTitle}>Public Data:</Text>
          <ScrollView style={styles.dataScroll}>
            <Text style={styles.dataText}>
              {publicData ? JSON.stringify(publicData, null, 2) : 'None'}
            </Text>
          </ScrollView>
        </View>

        <View style={styles.dataColumn}>
          <Text style={styles.dataTitle}>Auth Data:</Text>
          <ScrollView style={styles.dataScroll}>
            <Text style={styles.dataText}>
              {authData ? JSON.stringify(authData, null, 2) : 'None'}
            </Text>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  buttonRow: { flexDirection: 'row', marginBottom: 20 },
  button: { flex: 1, backgroundColor: '#ddd', padding: 10, margin: 5, borderRadius: 5 },
  dataContainer: { flex: 1, flexDirection: 'row' },
  dataColumn: { flex: 1, marginHorizontal: 5 },
  dataTitle: { fontWeight: 'bold', marginBottom: 10 },
  dataScroll: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  dataText: { fontSize: 12 }
});

export default ApiComparison;