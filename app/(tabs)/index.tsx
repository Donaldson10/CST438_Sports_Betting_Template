import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import { Image } from "expo-image";
import Button from "@/components/Button";
import {initializeDatabase } from "../../database/db";
import { useRouter } from 'expo-router';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    // Initialize the database and create tables when the component mounts
    const initializeDb = async () => {
      try {
        // call the function to initialize database and wait for it to finish
        await initializeDatabase();
      } catch (error) {
        console.error("Database initialization error: ", error);
        Alert.alert(
          "Error",
          "An error occurred while initializing the database."
        );
      }
    };

    initializeDb();

       // Fetch teams after the database has been initialized (For testing to see that our teams exist already)
      //  const fetchTeams = async () => {
      //   try {
      //     const teams = await getAllTeams();
      //     console.log('Teams in database:', teams);
      //   } catch (error) {
      //     console.error("Error fetching teams: ", error);
      //   }
      // };
  
      // fetchTeams();
  }, []);

  // Function to navigate to the login screen
  const handleLogin = () => {
    // Navigate directly to login tab
    router.push('/(tabs)/login');
  };

  // Function to navigate to the account creation screen  
  const handleCreateAccount = () => {
    // Navigate to login tab and show create account guidance
    router.push('/(tabs)/login');
    // Small delay then show alert
    setTimeout(() => {
      Alert.alert("Create Account", "Tap 'Need an account? Create one' to switch to account creation mode", [
        { text: "Got it!" }
      ]);
    }, 500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require("../../assets/images/loginPic.jpg")} style={styles.image} contentFit="cover" />
      </View>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Login" onPress={handleLogin} />
        <Button label="Create Account" onPress={handleCreateAccount} />
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: width * 0.95,
    height: height * 0.5,
    borderRadius: 18,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
});

export default Index;
