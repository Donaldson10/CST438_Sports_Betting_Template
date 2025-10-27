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
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navagation/types";
import { verifyUserLogin, getUserID, initializeDatabase, insertUser, isUsernameAvailable } from "../../database/db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// Enable OAuth redirects
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  // Account creation state
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // OAuth configuration
  const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://www.googleapis.com/oauth2/v4/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
  };

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

  const handleOAuthLogin = async () => {
    setOauthLoading(true);
    try {
      // Create OAuth request
      const request = new AuthSession.AuthRequest({
        clientId: 'your-google-client-id', // You'll need to set this up
        scopes: ['openid', 'profile', 'email'],
        redirectUri: AuthSession.makeRedirectUri({
          scheme: 'your-app-scheme'
        }),
        responseType: AuthSession.ResponseType.Code,
        codeChallenge: 'dummy-challenge', // In production, use proper PKCE
        codeChallengeMethod: AuthSession.CodeChallengeMethod.Plain,
      });

      const result = await request.promptAsync(discovery);
      
      if (result.type === 'success') {
        // Get access token and user info
        const { code } = result.params;
        
        // Exchange code for token (simplified for demo)
        // In production, you'd call your backend here
        const tokenResponse = await fetch('https://project2-438-backend-c8e29941b290.herokuapp.com/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
            client_id: 'your-google-client-id',
            redirect_uri: AuthSession.makeRedirectUri({
              scheme: 'your-app-scheme'
            }),
            grant_type: 'authorization_code',
          }),
        });

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          await AsyncStorage.setItem('oauth_token', tokenData.access_token);
          await AsyncStorage.setItem('username', 'oauth_user');
          Alert.alert('Success', 'OAuth login successful!');
        } else {
          Alert.alert('Error', 'Failed to exchange OAuth code for token');
        }
      } else {
        Alert.alert('Cancelled', 'OAuth login cancelled');
      }
    } catch (error) {
      console.error('OAuth error:', error);
      Alert.alert('Error', 'OAuth login failed');
    }
    setOauthLoading(false);
  };

  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }

    setLoading(true);

    try {
      // Check if the username already exists in the database
      const usernameExists = await isUsernameAvailable(username);
      if (!usernameExists) {
        Alert.alert("Error", "Username already exists!");
        setLoading(false);
        return;
      }

      // Insert the new user into the database
      await insertUser(username, password);

      // Account creation success
      Alert.alert("Account Created", `Welcome, ${username}! You can now log in.`, [
        {
          text: "OK",
          onPress: () => {
            // Switch back to login mode and clear fields
            setIsCreateMode(false);
            setEmail("");
            setConfirmPassword("");
            // Keep username and password for easy login
          }
        }
      ]);
    } catch (error) {
      console.error("Error creating account:", error);
      Alert.alert("Error", "An error occurred while creating the account.");
    }
    setLoading(false);
  };

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

          // User is now logged in - they can navigate using tabs
          console.log("Login successful - user can now use other tabs");
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

  if (!dbInitialized) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ImageBackground source={require("../../assets/images/loginPic2.jpg")} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            {isCreateMode ? "Create Account" : "Login"}
          </Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        
        {isCreateMode && (
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        )}
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        {isCreateMode && (
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        )}
        
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.buttonContainer}>
            <Button 
              title={isCreateMode ? "Create Account" : "Login with Username"} 
              onPress={isCreateMode ? handleCreateAccount : handleLogin} 
            />
            
            {!isCreateMode && (
              <>
                <View style={styles.separator}>
                  <Text style={styles.separatorText}>OR</Text>
                </View>
                
                {oauthLoading ? (
                  <ActivityIndicator size="large" color="#4285f4" />
                ) : (
                  <TouchableOpacity style={styles.oauthButton} onPress={handleOAuthLogin}>
                    <Text style={styles.oauthButtonText}>Login with Google OAuth</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
            
            <TouchableOpacity 
              style={styles.toggleModeButton} 
              onPress={() => {
                setIsCreateMode(!isCreateMode);
                // Clear form when switching modes
                setUsername("");
                setPassword("");
                setEmail("");
                setConfirmPassword("");
              }}
            >
              <Text style={styles.toggleModeText}>
                {isCreateMode ? "Already have an account? Login" : "Need an account? Create one"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
    width: "80%",
  },
  buttonContainer: {
    width: "80%",
    alignItems: "center",
  },
  separator: {
    marginVertical: 20,
    alignItems: "center",
  },
  separatorText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
  },
  oauthButton: {
    backgroundColor: "#4285f4",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  oauthButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleModeButton: {
    marginTop: 20,
    padding: 15,
  },
  toggleModeText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  createAccountButton: {
    marginTop: 10,
    padding: 10,
  },
  createAccountText: {
    color: "#007AFF",
    fontSize: 14,
    textAlign: "center",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
});