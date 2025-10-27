# Backend API Documentation

## Base URL
- **Production**: `https://project2-438-backend-c8e29941b290.herokuapp.com`

## Authentication
All `/api/*` endpoints require OAuth2 JWT Bearer token:
```javascript
headers: {
  'Authorization': 'Bearer <jwt_token>',
  'Content-Type': 'application/json'
}
```

## Public Endpoints (No Authentication Required)
- `GET /teams` - Get all teams
- `GET /games` - Get all games

## Authenticated Endpoints (Require Bearer Token)

### Teams API (`/api/teams`)
- `GET /api/teams` - Get all teams
- `GET /api/teams/{id}` - Get specific team by ID
- `POST /api/teams` - Create new team
- `PUT /api/teams/{id}` - Update existing team
- `DELETE /api/teams/{id}` - Delete team

### Games API (`/api/games`)
- `GET /api/games` - Get all games
- `GET /api/games/{id}` - Get specific game by ID
- `POST /api/games` - Create new game
- `PUT /api/games/{id}` - Update existing game
- `DELETE /api/games/{id}` - Delete game

### Favorites API (`/api/favorites`)
- `GET /api/favorites` - Get all favorites
- `GET /api/favorites/{id}` - Get specific favorite by ID
- `POST /api/favorites?userId={id}&teamId={id}&gameId={id}` - Add new favorite
- `DELETE /api/favorites/{id}` - Remove favorite

## Data Structures

### Team Object
```json
{
  "id": 1,
  "name": "Los Angeles Lakers",
  "nickname": "Lakers", 
  "logo": "logo-url",
  "nbaFranchise": true
}
```

### Game Object
```json
{
  "id": 1,
  "season": 2024,
  "team": "Los Angeles Lakers",
  "opponent": "Boston Celtics", 
  "date": "2024-12-25"
}
```

### Favorite Object
```json
{
  "favoriteId": 1,
  "userId": 123,
  "teamId": 456,
  "gameId": 789
}
```

## Current Frontend Implementation
The frontend currently uses the **public endpoints** (`/teams`, `/games`) for basic functionality. The authenticated endpoints (`/api/*`) are available for future features that require user-specific data or CRUD operations.