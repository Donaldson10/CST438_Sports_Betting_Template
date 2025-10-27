// Basic API integration tests

describe('Backend API Tests', () => {
  test('should connect to teams endpoint', async () => {
    const response = await fetch('https://project2-438-backend-c8e29941b290.herokuapp.com/teams');
    
    expect(response.status).toBe(200);
    
    const teams = await response.json();
    expect(Array.isArray(teams)).toBe(true);
    
    if (teams.length > 0) {
      expect(teams[0]).toHaveProperty('id');
      expect(teams[0]).toHaveProperty('name');
    }
  });

  test('should connect to games endpoint', async () => {
    const response = await fetch('https://project2-438-backend-c8e29941b290.herokuapp.com/games');
    
    expect(response.status).toBe(200);
    
    const games = await response.json();
    expect(Array.isArray(games)).toBe(true);
    
    if (games.length > 0) {
      expect(games[0]).toHaveProperty('id');
      expect(games[0]).toHaveProperty('team');
      expect(games[0]).toHaveProperty('opponent');
      expect(games[0]).toHaveProperty('date');
    }
  });

  test('should handle API errors gracefully', async () => {
    const response = await fetch('https://project2-438-backend-c8e29941b290.herokuapp.com/nonexistent');
    
    // Backend returns 401 for non-existent endpoints (due to security config)
    expect(response.status).toBe(401);
  });
});