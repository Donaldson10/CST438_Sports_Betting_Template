const BASE_URL = "https://project2-438-backend-c8e29941b290.herokuapp.com";

import AsyncStorage from '@react-native-async-storage/async-storage';

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
      throw new Error(`HTTP error! status: ${response.status}`);
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
    
    const json = await response.json();
    if (setJsonResponse) setJsonResponse(json);
    return json;
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
export const getFavorites = async () => {
  try {
    return await callBackendAPI("/api/favorites");
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};

export const addFavorite = async (userId, teamId, gameId) => {
  try {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (teamId) params.append('teamId', teamId);
    if (gameId) params.append('gameId', gameId);
    
    return await callBackendAPI(`/api/favorites?${params.toString()}`, null, 'POST');
  } catch (error) {
    console.error("Error adding favorite:", error);
    return null;
  }
};