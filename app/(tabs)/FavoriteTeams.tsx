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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTeams } from "../../utils/SimpleApi";
import {
  addTeamToFavs,
  removeTeamFromFav,
  getFavTeamNames,
  logDatabaseContents,
} from "../../database/db";

interface Team {
  id: string;
  name: string;
  nickname: string;
  logo: string;
}

const FavoriteTeams = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch username from AsyncStorage on component mount
  useEffect(() => {
    const fetchUserName = async () => {
      const storedUserName = await AsyncStorage.getItem("username");
      if (storedUserName) {
        setUsername(storedUserName);
        console.log("Teams tab - Fetched Username:", storedUserName);
      } else {
        console.warn("⚠ Teams tab - No username found in AsyncStorage");
      }
    };
    fetchUserName();
  }, []);

  // Initialize teams and favorites when username is available
  useEffect(() => {
    const initialize = async () => {
      if (!username) {
        return; // Wait for username to be loaded
      }

      setLoading(true);

      try {
        console.log("🏀 Teams tab - Loading teams and favorites...");
        
        // Load user's favorite teams
        const favTeams = await getFavTeamNames(username);
        setSelectedTeams(favTeams || []);
        console.log(`Teams tab - User ${username} has ${favTeams?.length || 0} favorite teams`);

        // Load all teams from backend API
        const teamData = await getTeams();

        if (teamData && teamData.length > 0) {
          // Transform backend team data to match expected format
          const formattedTeams = teamData.map((team: any) => ({
            id: team.id.toString(),
            name: team.name,
            nickname: team.nickname || team.name,
            logo: team.logo || "https://via.placeholder.com/40"
          }));
          setTeams(formattedTeams);
          console.log(`Teams tab - Loaded ${formattedTeams.length} teams from backend`);
        } else {
          console.error("Teams tab - No teams received from backend API.");
        }
      } catch (error) {
        console.error("Teams tab - Error fetching teams:", error);
      }

      setLoading(false);
    };

    initialize();
  }, [username]);

  const toggleTeamSelection = async (team_name: string) => {
    if (!username) {
      console.error("❌ No username available for team selection");
      return;
    }

    try {
      let updatedTeams = [...selectedTeams];

      if (updatedTeams.includes(team_name)) {
        console.log(`🔄 Removing ${team_name} from favorites...`);
        await removeTeamFromFav(username, team_name);
        updatedTeams = updatedTeams.filter((name) => name !== team_name);
        console.log(`✅ ${team_name} removed from favorites`);
      } else {
        console.log(`🔄 Adding ${team_name} to favorites...`);
        await addTeamToFavs(username, team_name);
        updatedTeams.push(team_name);
        console.log(`✅ ${team_name} added to favorites`);
      }

      setSelectedTeams(updatedTeams);
      await logDatabaseContents();
    } catch (error) {
      console.error(`❌ Failed to toggle team selection for ${team_name}:`, error);
      // You could show an alert to the user here
      // Alert.alert("Error", `Failed to update ${team_name}. Please try again.`);
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  // Show login prompt if no username is available
  if (!username) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Favorite Teams</Text>
        <Text style={styles.errorText}>Please log in to select your favorite teams.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Favorite Teams</Text>
      {teams.length === 0 ? (
        <Text style={styles.errorText}>No teams available. Check your connection.</Text>
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