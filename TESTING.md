# Testing Guide

This project includes basic tests to verify core functionality.

## Test Files

- `__tests__/simpleapi.test.js` - Tests SimpleApi functions (public and authenticated endpoints)

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
npx jest simpleapi.test.js
```

## Test Results

When you run `npx jest --verbose`, you should see:

```
SimpleApi Tests
✓ should export required functions
✓ should call public teams endpoint
✓ should call public games endpoint

Test Suites: 1 passed, 1 total
Tests: 3 passed, 3 total
```

## Test Coverage

The tests cover:
- ✅ SimpleApi function exports
- ✅ Public API endpoints (/teams, /games)
- ✅ Backend connectivity verification

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