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
import { getGames } from "../../utils/SimpleApi";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navagation/types";
import { getAllFavTeamInfo, logDatabaseContents } from "../../database/db";
import { useFocusEffect } from "@react-navigation/native";

interface Game {
  id: string;
  date: Date;
  homeTeam: { name: string; nickname: string; logo: string };
  awayTeam: { name: string; nickname: string; logo: string };
}

const UpcomingGames = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [games, setGames] = useState<Game[]>([]);
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
    setLoading(true);

    try {
      console.log("📡 Fetching games from backend...");
      const allBackendGames = await getGames();
      
      if (allBackendGames && allBackendGames.length > 0) {
        // Since the sample data spans multiple years (2021-2025), show games from a wide range
        const startDate = new Date();
        startDate.setFullYear(2024, 0, 1); // Start from January 1, 2024
        const endDate = new Date();
        endDate.setFullYear(2025, 11, 31); // End at December 31, 2025

        // Show all games within the date range (not just favorites)
        const upcomingGames = allBackendGames
          .filter((game: any) => {
            const gameDate = new Date(game.date);
            return gameDate >= startDate && gameDate <= endDate;
          })
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date (newest first)
          .slice(0, 20) // Limit to first 20 games
          .map((game: any) => ({
            id: game.id.toString(),
            date: new Date(game.date),
            homeTeam: { name: game.team, nickname: game.team, logo: "https://via.placeholder.com/30" },
            awayTeam: { name: game.opponent, nickname: game.opponent, logo: "https://via.placeholder.com/30" },
          }));

        console.log(`Found ${upcomingGames.length} recent games from backend`);
        setGames(upcomingGames);
        
        // If user is logged in, also check for favorites
        if (userName) {
          try {
            const favTeams = await getAllFavTeamInfo(userName);
            console.log(`User ${userName} has ${favTeams.length} favorite teams`);
          } catch (error) {
            console.log("Could not fetch favorite teams");
          }
        }
      } else {
        console.warn("No games found from backend");
        setGames([]);
      }
    } catch (error) {
      console.error("Error fetching games:", error);
      setGames([]);
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
      <Text style={styles.title}>Recent Games</Text>
      {games.length === 0 ? (
        <Text style={styles.errorText}>No upcoming games found. Check your connection or try again.</Text>
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isHomeTeam = item.homeTeam.name === "The home team from list";
            const winRate = isHomeTeam ? 0.51 : 0.49;

            return (
              <View style={styles.gameItem}>
                {/* Logos */}
                <View style={styles.teamLogoContainer}>
                  <Image
                    source={{ uri: item.homeTeam.logo }}
                    style={styles.teamLogo}
                  />
                  <Text style={styles.teamText}>
                    {item.homeTeam.name} vs {item.awayTeam.name}
                  </Text>
                  <Image
                    source={{ uri: item.awayTeam.logo }}
                    style={styles.teamLogo}
                  />
                </View>

                <Text style={styles.dateText}>
                  {item.date.toLocaleDateString()}
                </Text>
                <Text style={styles.winRateText}>
                  Win Rate: {winRate * 100}%
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
    fontSize: 22, // Adjusted font size for better fit
    fontWeight: "bold",
    marginBottom: 12, // Reduced margin for better fit on smaller screens
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
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 12,
  },
  teamText: {
    fontSize: 16, 
    textAlign: "center", 
  },
  dateText: {
    fontSize: 14, 
    color: "#666",
    textAlign: "center", 
  },
  winRateText: {
    fontSize: 14, 
    color: "#4CAF50",
    marginTop: 6, 
    textAlign: "center",
  },
  teamLogoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", 
    marginBottom: 8,  
  },
  teamLogo: {
    width: 30,
    height: 30,
    marginHorizontal: 8,
  },
});
export default UpcomingGames;
