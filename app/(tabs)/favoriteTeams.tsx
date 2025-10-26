import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { getAllTeams } from "../BackendApi";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addTeamToFavs,
  removeTeamFromFav,
  getFavTeamNames,
  logDatabaseContents,
} from "../../database/db";

// Backend Team interface based on Spring Boot entity
interface BackendTeam {
  id: number;
  name: string;
  city?: string;
  conference?: string;
  division?: string;
}

// Keep compatibility with existing UI
interface Team {
  id: string;
  name: string;
  nickname: string;
  logo: string;
}

const FavoriteTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      // Get username from AsyncStorage
      const storedUsername = await AsyncStorage.getItem('username');
      if (!storedUsername) {
        console.error("No username found in storage");
        setLoading(false);
        return;
      }
      setUsername(storedUsername);

      setLoading(true);

      try {
        const favTeams = await getFavTeamNames(username);
        setSelectedTeams(favTeams || []);

        // Fetch teams from backend API
        const backendTeams = await getAllTeams();
        
        if (backendTeams && backendTeams.length > 0) {
          // Convert backend team format to frontend team format
          const formattedTeams: Team[] = backendTeams.map((backendTeam: BackendTeam) => ({
            id: backendTeam.id.toString(),
            name: backendTeam.name,
            nickname: backendTeam.city || backendTeam.name,
            logo: "https://via.placeholder.com/40",
          }));
          setTeams(formattedTeams);
          console.log("Teams loaded from backend:", formattedTeams.length);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }

      setLoading(false);
    };

    initialize();
  }, []); // Run once on mount

  const toggleTeamSelection = async (team_name: string) => {
    if (!username) {
      console.error("No username available for team selection");
      return;
    }

    let updatedTeams = [...selectedTeams];

    if (updatedTeams.includes(team_name)) {
      await removeTeamFromFav(username, team_name);
      updatedTeams = updatedTeams.filter((name) => name !== team_name);
    } else {
      await addTeamToFavs(username, team_name);
      updatedTeams.push(team_name);
    }

    setSelectedTeams(updatedTeams);
    await logDatabaseContents();
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Favorite Teams</Text>
      {!username ? (
        <Text style={styles.errorText}>Please log in to select favorite teams.</Text>
      ) : teams.length === 0 ? (
        <Text style={styles.errorText}>No teams available. Check backend connection.</Text>
      ) : (
        <FlatList
          data={teams}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.teamItem,
                selectedTeams.includes(item.name) ? styles.selectedTeam : {},
              ]}
              onPress={() => toggleTeamSelection(item.name)}
            >
              <View style={styles.teamContainer}>
                <Image source={{ uri: item.logo }} style={styles.logo} />
                <Text style={styles.teamText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "red", textAlign: "center" },
  teamItem: {
    padding: 15,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  teamContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: { width: 40, height: 40, marginRight: 10, resizeMode: "contain" },
  selectedTeam: { backgroundColor: "#87CEFA" },
  teamText: { fontSize: 18 },
});

export default FavoriteTeams;