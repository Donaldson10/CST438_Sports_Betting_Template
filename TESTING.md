# Testing Guide

This project includes basic tests to verify core functionality.

## Test Files

- `__tests__/database.test.js` - Tests database logic (user validation, team name validation)
- `__tests__/api.test.js` - Tests backend API integration (public endpoints)  
- `__tests__/auth.test.js` - Tests authentication storage (token handling, logout)
- `__tests__/authenticated-api.test.js` - Tests authenticated API endpoints (Bearer token required)

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests Once (without watch mode)
```bash
npx jest
```

### Run Tests with Detailed Output
```bash
npx jest --verbose
```

### Run Specific Test File
```bash
npx jest database.test.js
npx jest api.test.js
npx jest auth.test.js
npx jest authenticated-api.test.js
```

## Test Results

When you run `npx jest --verbose`, you should see:

```
Database Tests
✓ should validate user login logic
✓ should reject invalid password  
✓ should handle empty username
✓ should validate team name format

Authentication Tests
✓ should store authentication token
✓ should retrieve authentication token
✓ should check authentication status
✓ should clear authentication data on logout

Backend API Tests
✓ should connect to teams endpoint
✓ should connect to games endpoint
✓ should handle API errors gracefully

Authenticated API Tests
✓ should require authentication for /api/teams
✓ should require authentication for /api/games  
✓ should require authentication for /api/favorites
✓ should reject invalid Bearer token

Test Suites: 4 passed, 4 total
Tests: 15 passed, 15 total
```

## Test Coverage

The tests cover:
- User login validation logic
- Password verification
- Input validation (empty usernames, team names)
- Authentication token storage/retrieval
- Backend API connectivity (requires internet)
- Error handling for invalid API endpoints

## API Endpoints Tested

Current tests use **public endpoints** (no authentication required):
- `GET /teams` - Returns all teams data
- `GET /games` - Returns all games data

The backend also provides **authenticated endpoints** (`/api/teams`, `/api/games`, `/api/favorites`) that require OAuth2 Bearer tokens. See `API.md` for complete documentation.

## Notes

- Database tests use mocked SQLite for testing environment compatibility
- API tests require internet connection to reach the backend at `https://project2-438-backend-c8e29941b290.herokuapp.com`
- Auth tests use mocked AsyncStorage for unit testing
- All tests are designed to run in the Jest testing environment without Expo dependencies
- Tests currently use public endpoints; authenticated endpoint testing would require valid JWT tokens