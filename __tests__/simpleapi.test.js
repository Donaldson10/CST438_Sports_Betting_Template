// Simple test for authenticated API functions
describe('SimpleApi Tests', () => {
  test('should export required functions', () => {
    const api = require('../app/SimpleApi');
    
    expect(typeof api.callAPI).toBe('function');
    expect(typeof api.getTeams).toBe('function');
    expect(typeof api.getGames).toBe('function');
    expect(typeof api.getAuthTeams).toBe('function');
    expect(typeof api.getAuthGames).toBe('function');
    expect(typeof api.getFavorites).toBe('function');
    expect(typeof api.addFavorite).toBe('function');
  });

  test('should call public teams endpoint', async () => {
    const { getTeams } = require('../app/SimpleApi');
    
    const teams = await getTeams();
    
    expect(Array.isArray(teams)).toBe(true);
    if (teams.length > 0) {
      expect(teams[0]).toHaveProperty('id');
      expect(teams[0]).toHaveProperty('name');
    }
  });

  test('should call public games endpoint', async () => {
    const { getGames } = require('../app/SimpleApi');
    
    const games = await getGames();
    
    expect(Array.isArray(games)).toBe(true);
    if (games.length > 0) {
      expect(games[0]).toHaveProperty('id');
      expect(games[0]).toHaveProperty('team');
    }
  });
});