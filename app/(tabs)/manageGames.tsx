import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getAllGames, createGame, deleteGame } from "../BackendApi";

interface Game {
  id: number;
  season: number;
  team: string;
  opponent: string;
  date: string;
}

const ManageGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Form fields for adding a new game
  const [newSeason, setNewSeason] = useState<string>("");
  const [newTeam, setNewTeam] = useState<string>("");
  const [newOpponent, setNewOpponent] = useState<string>("");
  const [newDate, setNewDate] = useState<string>("");
  const [adding, setAdding] = useState<boolean>(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const fetchedGames = await getAllGames();
      if (fetchedGames && fetchedGames.length > 0) {
        setGames(fetchedGames);
        console.log(`Loaded ${fetchedGames.length} games from backend`);
      } else {
        setGames([]);
        console.log("No games found");
      }
    } catch (error) {
      console.error("Error fetching games:", error);
      Alert.alert("Error", "Failed to fetch games from backend");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAddGame = async () => {
    if (!newSeason || !newTeam || !newOpponent || !newDate) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Basic date validation (YYYY-MM-DD format)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(newDate)) {
      Alert.alert("Invalid Date", "Please use format: YYYY-MM-DD\nExample: 2024-12-25");
      return;
    }

    setAdding(true);
    try {
      const newGame = {
        season: parseInt(newSeason),
        team: newTeam.trim(),
        opponent: newOpponent.trim(),
        date: newDate,
      };

      console.log("Adding game:", newGame);
      const result = await createGame(newGame);
      console.log("Add game result:", result);
      
      if (result) {
        Alert.alert("Success", "Game added!");
        // Clear form
        setNewSeason("");
        setNewTeam("");
        setNewOpponent("");
        setNewDate("");
        // Refresh the list
        await fetchGames();
      } else {
        Alert.alert("Error", "Could not add game!");
      }
    } catch (error) {
      console.error("Error adding game:", error);
      Alert.alert("Error", "Could not add game!");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteGame = async (gameId: number, teamName: string) => {
    Alert.alert(
      "Delete Game",
      `Delete ${teamName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("Deleting game with ID:", gameId);
              const result = await deleteGame(gameId);
              console.log("Delete game result:", result);
              
              if (result && (result.success || result)) {
                Alert.alert("Success", "Game deleted!");
                await fetchGames(); // Refresh the list
              } else {
                Alert.alert("Error", "Could not delete game!");
              }
            } catch (error) {
              console.error("Error deleting game:", error);
              Alert.alert("Error", "Could not delete game!");
            }
          },
        },
      ]
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchGames();
  };

  if (loading) {
    return (
      <ActivityIndicator
        style={styles.loader}
        size="large"
        color="#0000ff"
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Games</Text>

      {/* Add Game Form */}
      <View style={styles.addGameSection}>
        <Text style={styles.sectionTitle}>Add New Game</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Season (e.g., 2024)"
          value={newSeason}
          onChangeText={setNewSeason}
          keyboardType="numeric"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Team Name (e.g., Lakers)"
          value={newTeam}
          onChangeText={setNewTeam}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Opponent Name (e.g., Warriors)"
          value={newOpponent}
          onChangeText={setNewOpponent}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Date: YYYY-MM-DD (e.g., 2024-12-25)"
          value={newDate}
          onChangeText={setNewDate}
        />

        <TouchableOpacity
          style={[styles.addButton, adding && styles.buttonDisabled]}
          onPress={handleAddGame}
          disabled={adding}
        >
          {adding ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>Add Game</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Games List */}
      <View style={styles.gamesSection}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>All Games ({games.length})</Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {games.length === 0 ? (
          <Text style={styles.errorText}>No games available</Text>
        ) : (
          <FlatList
            data={games}
            keyExtractor={(item) => item.id.toString()}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            renderItem={({ item }) => (
              <View style={styles.gameItem}>
                <View style={styles.gameInfo}>
                  <Text style={styles.gameText}>
                    {item.team} vs {item.opponent}
                  </Text>
                  <Text style={styles.gameSubText}>
                    Season: {item.season} | Date: {item.date}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteGame(item.id, `${item.team} vs ${item.opponent}`)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addGameSection: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  gamesSection: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  refreshButton: {
    backgroundColor: "#2196F3",
    padding: 8,
    borderRadius: 5,
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  gameItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fafafa",
    marginBottom: 5,
    borderRadius: 5,
  },
  gameInfo: {
    flex: 1,
  },
  gameText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  gameSubText: {
    fontSize: 12,
    color: "#666",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ManageGames;
