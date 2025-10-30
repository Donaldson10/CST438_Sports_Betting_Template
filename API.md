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

### Teams API
- `GET /teams` - Get all teams
- `GET /teams/{id}` - Get specific team by ID
- `POST /teams` - Create new team
- `PUT /teams/{id}` - Update existing team
- `DELETE /teams/{id}` - Delete team

### Games API
- `GET /games` - Get all games
- `GET /games/{id}` - Get specific game by ID
- `GET /games/id/{id}` - Get game by ID (alternative endpoint)
- `POST /games` - Create new game
- `DELETE /games/{id}` - Delete game

### User Authentication API (Expected)
- `POST /api/users/register` - Register new user
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- `POST /api/users/login` - Login user
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- `GET /api/users/check-username/{username}` - Check username availability

## Authenticated Endpoints (Require Bearer Token)

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
The frontend uses:
- **Public endpoints** (`/teams`, `/games`) for basic functionality
- **User registration/login** for account management
- **Authenticated endpoints** (`/api/favorites`) for user-specific data
- **Google OAuth2** as an alternative login method