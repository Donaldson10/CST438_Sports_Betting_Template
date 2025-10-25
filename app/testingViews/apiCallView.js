import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Text, View, ScrollView } from 'react-native';

import { getAllGames } from '../BackendApi';

const ApiCallView = () => {
  const [isLoading, setLoading] = useState(true);
  const [jsonResponse, setJsonResponse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Making API call to backend /games endpoint...');
        const gamesData = await getAllGames();
        setJsonResponse(gamesData);
        console.log('API call completed successfully.');
      } catch (error) {
        console.error('Error during backend API call:', error);
        setJsonResponse(null);
      } finally {
        setLoading(false);
        console.log('Loading set to false.');
      }
    };

    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: '#fff' }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <ScrollView>
          {jsonResponse ? (
            <Text selectable>{JSON.stringify(jsonResponse, null, 2)}</Text>
          ) : (
            <Text>No data returned from API.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default ApiCallView;