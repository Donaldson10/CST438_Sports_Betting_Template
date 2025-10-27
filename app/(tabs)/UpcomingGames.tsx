import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllGames } from "../BackendApi";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navagation/types";
import { getAllFavTeamInfo, logDatabaseContents } from "../../database/db";
import { useFocusEffect } from "@react-navigation/native";

interface BackendGame {
  id: number;
  season: number;
  team: string;
  opponent: string;
  date: string;
}

interface DisplayGame {
  id: string;
  date: Date;
  team: string;
  opponent: string;
  season: number;
}

const UpcomingGames = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [games, setGames] = useState<DisplayGame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userName, setUserName] = useState<string | null>(null);

  // Fetch username from AsyncStorage
  useEffect(() => {
    const fetchUserName = async () => {
      const storedUserName = await AsyncStorage.getItem("username");
      if (storedUserName) {
        setUserName(storedUserName);
        console.log("Fetched Username: ", storedUserName);
      } else {
        console.warn("⚠ No username found in AsyncStorage");
      }
    };
    fetchUserName();
  }, []);

  // Reusable fetchGames function (Made Reusable for focus effect)
  const fetchGames = useCallback(async () => {
    if (!userName) return;
    setLoading(true);

    try {
      // Log the database contents after the update (Full check)
      await logDatabaseContents();

      // Fetch favorite teams directly from the database using the username
      const favTeams = await getAllFavTeamInfo(userName);
      const favTeamNames = favTeams.map((team) => team[1]); // team[1] is the team name
      console.log("Favorite team names:", favTeamNames);
      
      if (favTeamNames.length === 0) {
        console.warn("No favorite teams found.");
        setGames([]);
        return;
      }

      // Get games from backend
      console.log("getting games from backend...");
      const allBackendGames: BackendGame[] = await getAllGames();

      console.log(`Total games: ${allBackendGames.length}`);

      // Filter games for favorite teams and upcoming dates
      const currentDate = new Date();
      const endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() + 14);
      
      const upcomingGames = allBackendGames
        .filter((game) => {
          // Check if either team or opponent is in favorites
          const gameDate = new Date(game.date);
          const isTeamFavorite = favTeamNames.includes(game.team);
          const isOpponentFavorite = favTeamNames.includes(game.opponent);
          const isUpcoming = gameDate >= currentDate && gameDate <= endDate;
          
          return (isTeamFavorite || isOpponentFavorite) && isUpcoming;
        })
        .map((game) => ({
          id: game.id.toString(),
          date: new Date(game.date),
          team: game.team,
          opponent: game.opponent,
          season: game.season,
        }));

      console.log(`Upcoming games for favorites: ${upcomingGames.length}`);
      setGames(upcomingGames);
      
      if (upcomingGames.length === 0) {
        console.warn("No upcoming games found for favorite teams.");
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  }, [userName]);

  // Fetch games whenever userName changes
  useEffect(() => {
    fetchGames();
  }, [userName, fetchGames]);

  // This allows the view to update when doing tab navigation.
  useFocusEffect(
    useCallback(() => {
      console.log("re-fetching games...");
      fetchGames();
    }, [fetchGames])
  );

  if (loading)
    return (
      <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Games for Your Teams</Text>
      {games.length === 0 ? (
        <Text style={styles.errorText}>No upcoming games found.</Text>
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            // Simple win rate calculation for demo
            const winRate = 0.5; // 50% default win rate

            return (
              <View style={styles.gameItem}>
                <View style={styles.teamContainer}>
                  <Text style={styles.teamText}>
                    {item.team} vs {item.opponent}
                  </Text>
                </View>

                <Text style={styles.dateText}>
                  {item.date.toLocaleDateString()}
                </Text>
                <Text style={styles.seasonText}>
                  Season: {item.season}
                </Text>
                <Text style={styles.winRateText}>
                  Win Rate: {(winRate * 100).toFixed(1)}%
                </Text>
              </View>
            );
          }}
        />
      )}
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  gameItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  teamContainer: {
    marginBottom: 8,
  },
  teamText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  dateText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 4,
  },
  seasonText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginBottom: 4,
  },
  winRateText: {
    fontSize: 14,
    color: "#4CAF50",
    textAlign: "center",
    fontWeight: "600",
  },
});
export default UpcomingGames;
