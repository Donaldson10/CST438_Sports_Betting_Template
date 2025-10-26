import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { verifyUserLogin, getUserID, initializeDatabase } from "../../database/db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthService from "../services/AuthService";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  useEffect(() => {
    const initializeDb = async () => {
      try {
        await initializeDatabase();
        setDbInitialized(true);
      } catch (error) {
        console.error("Database initialization error:", error);
        Alert.alert("Error", "An error occurred while initializing the database.");
      }
    };

    initializeDb();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const isValidUser = await verifyUserLogin(username, password);
      setLoading(false);

      if (isValidUser) {
        const userID = await getUserID(username);

        if (userID) {
          //await AsyncStorage.setItem("userID", userID.toString()); // Store userID
          await AsyncStorage.setItem("username", username);  // Store username
          Alert.alert("Welcome", "You are now logged in!");

          setTimeout(() => {
            router.push("/favoriteTeams"); // Navigate to favorite teams
          }, 500);
        } else {
          Alert.alert("Error", "User not found.");
        }
      } else {
        Alert.alert("Error", "Incorrect username or password.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "An error occurred while verifying login.");
      console.error(error);
    }
  };

  // OAuth2 Google Login
  const handleOAuthLogin = async () => {
    setOauthLoading(true);
    
    try {
      const result = await AuthService.loginWithGoogle();
      
      if (result.success) {
        Alert.alert("Welcome", `Hello ${result.userInfo?.name}! You are now logged in with OAuth2!`);
        
        // Store user info
        await AsyncStorage.setItem("username", result.userInfo?.email || "user");
        
        setTimeout(() => {
          router.push("/favoriteTeams");
        }, 500);
      } else {
        Alert.alert("Login Failed", result.error || "OAuth login failed");
      }
    } catch (error) {
      console.error("OAuth login error:", error);
      Alert.alert("Error", "An error occurred during OAuth login");
    } finally {
      setOauthLoading(false);
    }
  };

  if (!dbInitialized) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sports Betting App</Text>
      
      {oauthLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.googleButton} onPress={handleOAuthLogin}>
          <Text style={styles.googleButtonText}>Login with Google</Text>
        </TouchableOpacity>
      )}
      
      <Text style={styles.orText}>or</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  googleButton: {
    backgroundColor: "#4285f4",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    width: "80%",
    alignItems: "center",
  },
  googleButtonText: {
    color: "white",
    fontSize: 16,
  },
  orText: {
    fontSize: 16,
    marginVertical: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    width: "80%",
  },
});