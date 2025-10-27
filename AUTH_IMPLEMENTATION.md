# Authenticated API Implementation

## Overview
This is a simple implementation of authenticated API endpoints that demonstrates both public and token-based authentication.

## Files Added

### `app/SimpleApi.js` (40 lines)
Simple API wrapper with both public and authenticated endpoints:
- Public: `getTeams()`, `getGames()`  
- Authenticated: `getAuthTeams(token)`, `getAuthGames(token)`, `getFavorites(token)`, `addFavorite(token, userId, teamId, gameId)`

### `app/(tabs)/auth-demo.tsx` (150 lines)
Demo screen showing how to:
- Check for stored authentication token
- Call authenticated endpoints
- Handle success/failure responses
- Display results

### `app/testingViews/AuthApiTest.js` (80 lines)
Testing component for authenticated endpoints

## How It Works

1. **Login** → Gets JWT token from Google OAuth → Stores in AsyncStorage
2. **Auth Demo Tab** → Reads token from storage → Calls authenticated endpoints
3. **Success/Failure** → Shows response or error message

## Usage

1. Login using Google OAuth (Login tab)
2. Go to "API Demo" tab  
3. Click "Test /api/teams" to test authenticated endpoint
4. See success (with data) or failure (401 Unauthorized)

## Implementation Notes

- **Super simple**: Each function is ~10 lines
- **Student-appropriate**: Basic error handling, no complex patterns
- **Demonstrates concept**: Shows difference between public vs authenticated APIs
- **Working example**: Actually calls your live backend

## Testing

```bash
npx jest simpleapi.test.js
```

Tests verify:
- Functions are exported correctly
- Public endpoints work
- API structure is correct

This is the kind of quick implementation you could put together in an hour or two when you realize you need to demonstrate authenticated API usage!