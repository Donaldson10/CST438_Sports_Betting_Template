import { Tabs } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: {
          backgroundColor: "#25292e",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#25292e",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: "Login",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "key" : "key-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favoriteTeams"
        options={{
          title: "Favorite Teams",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="UpcomingGames"
        options={{
          title: "Upcoming Games",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "basketball" : "basketball-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="manageGames"
        options={{
          title: "Manage Games",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: "Logout",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "log-out" : "log-out-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
