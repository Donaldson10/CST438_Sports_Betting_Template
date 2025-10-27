# Testing Guide

This project includes basic tests to verify core functionality.

## Test Files

- `__tests__/database.test.js` - Tests database operations (user creation, login, favorites)
- `__tests__/api.test.js` - Tests backend API integration (teams and games endpoints)  
- `__tests__/auth.test.js` - Tests authentication service (token storage, logout)

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

### Run Specific Test File
```bash
npx jest database.test.js
npx jest api.test.js
npx jest auth.test.js
```

## Test Coverage

The tests cover:
- User registration and login
- Favorite team management  
- Backend API connectivity
- uthentication token handling

## Notes

- Database tests create temporary test users
- API tests require internet connection to reach the backend
- Auth tests use mocked AsyncStorage for unit testing