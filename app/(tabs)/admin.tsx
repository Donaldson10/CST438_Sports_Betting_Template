import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { addGame, deleteGame, addTeam } from '../../utils/SimpleApi';

export default function SimpleAdmin() {
  const [teamName, setTeamName] = useState('');
  const [gameTeam, setGameTeam] = useState('');
  const [gameOpponent, setGameOpponent] = useState('');
  const [gameDate, setGameDate] = useState('');
  const [deleteGameId, setDeleteGameId] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Simple admin credentials (in production, this should be more secure)
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'admin123';

  const handleAdminLogin = () => {
    if (adminUsername === ADMIN_USERNAME && adminPassword === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      Alert.alert('Success', 'Admin login successful!');
      setAdminUsername('');
      setAdminPassword('');
    } else {
      Alert.alert('Error', 'Invalid admin credentials');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    Alert.alert('Logged Out', 'Admin logged out successfully');
  };

  const handleAddTeam = async () => {
    if (!teamName.trim()) {
      Alert.alert('Error', 'Please enter a team name');
      return;
    }

    setLoading(true);
    const teamData = {
      name: teamName,
      nickname: teamName,
      logo: 'https://via.placeholder.com/40',
      nbaFranchise: true
    };

    const result = await addTeam(teamData);
    setLoading(false);

    if (result) {
      Alert.alert('Success', `Team "${teamName}" added!`);
      setTeamName('');
    } else {
      Alert.alert('Error', 'Failed to add team');
    }
  };

  const handleAddGame = async () => {
    if (!gameTeam.trim() || !gameOpponent.trim() || !gameDate.trim()) {
      Alert.alert('Error', 'Please fill in all game fields');
      return;
    }

    setLoading(true);
    const gameData = {
      season: 2024,
      team: gameTeam,
      opponent: gameOpponent,
      date: gameDate
    };

    const result = await addGame(gameData);
    setLoading(false);

    if (result) {
      Alert.alert('Success', `Game "${gameTeam} vs ${gameOpponent}" added!`);
      setGameTeam('');
      setGameOpponent('');
      setGameDate('');
    } else {
      Alert.alert('Error', 'Failed to add game');
    }
  };

  const handleDeleteGame = async () => {
    if (!deleteGameId.trim()) {
      Alert.alert('Error', 'Please enter a game ID');
      return;
    }

    setLoading(true);
    const success = await deleteGame(deleteGameId);
    setLoading(false);

    if (success) {
      Alert.alert('Success', `Game ${deleteGameId} deleted!`);
      setDeleteGameId('');
    } else {
      Alert.alert('Error', 'Failed to delete game');
    }
  };

  // Show admin login form if not logged in
  if (!isAdminLoggedIn) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Admin Login Required</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin Access</Text>
          <TextInput
            style={styles.input}
            placeholder="Admin Username"
            value={adminUsername}
            onChangeText={setAdminUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Admin Password"
            value={adminPassword}
            onChangeText={setAdminPassword}
            secureTextEntry
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={handleAdminLogin}
          >
            <Text style={styles.buttonText}>Login as Admin</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.note}>
          Admin credentials required to access database operations.
          {'\n\n'}Username: admin{'\n'}Password: admin123
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Admin Database Operations</Text>
        <TouchableOpacity 
          style={[styles.button, styles.logoutButton]}
          onPress={handleAdminLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      {/* Add Team Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Team</Text>
        <TextInput
          style={styles.input}
          placeholder="Team Name (e.g., Miami Heat)"
          value={teamName}
          onChangeText={setTeamName}
        />
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleAddTeam}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Add Team</Text>
        </TouchableOpacity>
      </View>

      {/* Add Game Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Game</Text>
        <TextInput
          style={styles.input}
          placeholder="Team Name"
          value={gameTeam}
          onChangeText={setGameTeam}
        />
        <TextInput
          style={styles.input}
          placeholder="Opponent Name"
          value={gameOpponent}
          onChangeText={setGameOpponent}
        />
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={gameDate}
          onChangeText={setGameDate}
        />
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleAddGame}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Add Game</Text>
        </TouchableOpacity>
      </View>

      {/* Delete Game Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delete Game</Text>
        <TextInput
          style={styles.input}
          placeholder="Game ID to delete"
          value={deleteGameId}
          onChangeText={setDeleteGameId}
          keyboardType="numeric"
        />
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton, loading && styles.buttonDisabled]} 
          onPress={handleDeleteGame}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Delete Game</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>
        Note: These operations connect directly to the backend database.
        Use carefully as changes are permanent.
      </Text>
    </ScrollView>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  note: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
});