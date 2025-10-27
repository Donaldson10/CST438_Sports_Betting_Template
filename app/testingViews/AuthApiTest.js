import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { getAuthTeams, getAuthGames, getFavorites, addFavorite } from '../SimpleApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthApiTest = () => {
  const [data, setData] = useState(null);
  const [token, setToken] = useState(null);
  const [status, setStatus] = useState('No token');

  useEffect(() => {
    // Get token from storage
    AsyncStorage.getItem('accessToken').then(setToken);
  }, []);

  const testAuthTeams = async () => {
    if (!token) {
      setStatus('Need to login first');
      return;
    }
    setStatus('Loading teams...');
    const teams = await getAuthTeams(token);
    setData(teams);
    setStatus(teams ? 'Auth teams loaded' : 'Auth failed');
  };

  const testAuthGames = async () => {
    if (!token) {
      setStatus('Need to login first');
      return;
    }
    setStatus('Loading games...');
    const games = await getAuthGames(token);
    setData(games);
    setStatus(games ? 'Auth games loaded' : 'Auth failed');
  };

  const testFavorites = async () => {
    if (!token) {
      setStatus('Need to login first');
      return;
    }
    setStatus('Loading favorites...');
    const favorites = await getFavorites(token);
    setData(favorites);
    setStatus(favorites ? 'Favorites loaded' : 'No favorites');
  };

  const testAddFavorite = async () => {
    if (!token) {
      setStatus('Need to login first');
      return;
    }
    setStatus('Adding favorite...');
    const result = await addFavorite(token, 1, 1, 1);
    setStatus(result ? 'Favorite added' : 'Add failed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auth API Testing</Text>
      <Text>Status: {status}</Text>
      <Text>Token: {token ? 'Available' : 'None'}</Text>
      
      <TouchableOpacity style={styles.button} onPress={testAuthTeams}>
        <Text>Test Auth Teams</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testAuthGames}>
        <Text>Test Auth Games</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testFavorites}>
        <Text>Test Favorites</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testAddFavorite}>
        <Text>Add Test Favorite</Text>
      </TouchableOpacity>
      
      <ScrollView style={styles.data}>
        <Text>{data ? JSON.stringify(data, null, 2) : 'No data'}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  button: { backgroundColor: '#ddd', padding: 10, margin: 5, borderRadius: 5 },
  data: { flex: 1, marginTop: 20, backgroundColor: '#f5f5f5', padding: 10 }
});

export default AuthApiTest;