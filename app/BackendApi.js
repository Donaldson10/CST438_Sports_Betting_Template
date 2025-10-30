const BASE_URL = "https://project2-438-backend-c8e29941b290.herokuapp.com";

import AsyncStorage from '@react-native-async-storage/async-storage';

// API Endpoints based on your Spring Boot backend:
// Games: /games (GET all, POST, DELETE/{id}, GET/{id})
// Teams: /teams (GET all, POST, PUT/{id}, DELETE/{id}, GET/{id})
// Favorites: /favorites (GET all, POST, PUT/{id}, DELETE/{id}, GET/user/{userId})

export const callBackendAPI = async (endpoint, setJsonResponse, method = 'GET', body = null) => {
  try {
    const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    
    const headers = { 
      "Content-Type": "application/json"
    };
    
    console.log('Making API call to backend:', url);
    
    const fetchOptions = {
      method: method,
      headers: headers,
    };
    
    if (body && method !== 'GET') {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    
    const response = await fetch(url, fetchOptions);

    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('text/html')) {
      console.error('Got HTML response instead of JSON API data');
      return null;
    }



    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status} for URL: ${url}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      // For 401 errors, provide more specific message
      if (response.status === 401) {
        console.error('Authentication required. Backend may need security configuration update.');
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // For DELETE requests, just return success if status is OK
    if (method === 'DELETE' && response.ok) {
      return { success: true };
    }
    
    // For POST requests that might not return JSON
    if (method === 'POST' && response.status === 200) {
      try {
        const json = await response.json();
        if (setJsonResponse) setJsonResponse(json);
        return json;
      } catch (e) {
        return { success: true };
      }
    }
    
    // Try to parse JSON response
    try {
      const json = await response.json();
      if (setJsonResponse) setJsonResponse(json);
      return json;
    } catch (e) {
      // If no JSON body, return success for successful responses
      return response.ok ? { success: true } : null;
    }
  } catch (error) {
    console.error("Error calling backend API:", error);
    if (setJsonResponse) setJsonResponse(null);
    return null;
  }
};

// Example functions to call backend endpoints
export const getAllTeams = async () => {
  try {
    return await callBackendAPI("/teams");
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
};

export const getAllGames = async () => {
  try {
    return await callBackendAPI("/games");
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
};

export const getGameById = async (id) => {
  try {
    return await callBackendAPI(`/games/${id}`);
  } catch (error) {
    console.error(`Error fetching game ${id}:`, error);
    return null;
  }
};

export const getTeamById = async (id) => {
  try {
    return await callBackendAPI(`/teams/${id}`);
  } catch (error) {
    console.error(`Error fetching team ${id}:`, error);
    return null;  
  }
};

// Add favorites API calls
export const getAllFavorites = async () => {
  try {
    return await callBackendAPI("/favorites");
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};

export const getFavoritesByUser = async (userId) => {
  try {
    return await callBackendAPI(`/favorites/user/${userId}`);
  } catch (error) {
    console.error(`Error fetching favorites for user ${userId}:`, error);
    return [];
  }
};

export const addFavorite = async (favorite) => {
  try {
    // favorite should be an object like: { userId: 1, teamId: 2, gameId: 3 }
    return await callBackendAPI("/favorites", null, 'POST', favorite);
  } catch (error) {
    console.error("Error adding favorite:", error);
    return null;
  }
};

export const addFavoriteByGame = async (gameId, favorite) => {
  try {
    // favorite should be an object like: { userId: 1, teamId: 2 }
    return await callBackendAPI(`/favorites/game/${gameId}`, null, 'POST', favorite);
  } catch (error) {
    console.error("Error adding favorite by game:", error);
    return null;
  }
};

export const updateFavorite = async (id, favorite) => {
  try {
    return await callBackendAPI(`/favorites/${id}`, null, 'PUT', favorite);
  } catch (error) {
    console.error(`Error updating favorite ${id}:`, error);
    return null;
  }
};

export const updateFavoriteByUserAndTeam = async (userId, teamId, favorite) => {
  try {
    return await callBackendAPI(`/favorites/user/${userId}/team/${teamId}`, null, 'PUT', favorite);
  } catch (error) {
    console.error(`Error updating favorite for user ${userId} and team ${teamId}:`, error);
    return null;
  }
};

export const deleteFavorite = async (id) => {
  try {
    return await callBackendAPI(`/favorites/${id}`, null, 'DELETE');
  } catch (error) {
    console.error(`Error deleting favorite ${id}:`, error);
    return null;
  }
};

export const deleteFavoriteByUserAndTeam = async (userId, teamId) => {
  try {
    return await callBackendAPI(`/favorites/user/${userId}/team/${teamId}`, null, 'DELETE');
  } catch (error) {
    console.error(`Error deleting favorite for user ${userId} and team ${teamId}:`, error);
    return null;
  }
};

// Create a new game
export const createGame = async (game) => {
  try {
    return await callBackendAPI("/games", null, 'POST', game);
  } catch (error) {
    console.error("Error creating game:", error);
    return null;
  }
};

// Delete a game
export const deleteGame = async (id) => {
  try {
    return await callBackendAPI(`/games/${id}`, null, 'DELETE');
  } catch (error) {
    console.error(`Error deleting game ${id}:`, error);
    return null;
  }
};

// Create a new team
export const createTeam = async (team) => {
  try {
    return await callBackendAPI("/teams", null, 'POST', team);
  } catch (error) {
    console.error("Error creating team:", error);
    return null;
  }
};

// Update a team
export const updateTeam = async (id, team) => {
  try {
    return await callBackendAPI(`/teams/${id}`, null, 'PUT', team);
  } catch (error) {
    console.error(`Error updating team ${id}:`, error);
    return null;
  }
};

// Delete a team
export const deleteTeam = async (id) => {
  try {
    return await callBackendAPI(`/teams/${id}`, null, 'DELETE');
  } catch (error) {
    console.error(`Error deleting team ${id}:`, error);
    return null;
  }
};
