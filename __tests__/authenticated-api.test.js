// Tests for authenticated API endpoints (require Bearer tokens)

describe('Authenticated API Tests', () => {
  const baseUrl = 'https://project2-438-backend-c8e29941b290.herokuapp.com';
  
  test('should require authentication for /api/teams', async () => {
    const response = await fetch(`${baseUrl}/api/teams`);
    
    // Should return 401 Unauthorized without Bearer token
    expect(response.status).toBe(401);
  });

  test('should require authentication for /api/games', async () => {
    const response = await fetch(`${baseUrl}/api/games`);
    
    // Should return 401 Unauthorized without Bearer token
    expect(response.status).toBe(401);
  });

  test('should require authentication for /api/favorites', async () => {
    const response = await fetch(`${baseUrl}/api/favorites`);
    
    // Should return 401 Unauthorized without Bearer token
    expect(response.status).toBe(401);
  });

  test('should reject invalid Bearer token', async () => {
    const response = await fetch(`${baseUrl}/api/teams`, {
      headers: {
        'Authorization': 'Bearer invalid-token-123',
        'Content-Type': 'application/json'
      }
    });
    
    // Should return 401 Unauthorized with invalid token
    expect(response.status).toBe(401);
  });
});