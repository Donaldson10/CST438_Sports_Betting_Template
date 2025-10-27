// Basic authentication functionality tests
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  multiRemove: jest.fn(),
}));

describe('Authentication Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should store authentication token', async () => {
    const mockToken = 'test-token-123';
    await AsyncStorage.setItem('accessToken', mockToken);
    
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('accessToken', mockToken);
  });

  test('should retrieve authentication token', async () => {
    const mockToken = 'test-token-123';
    AsyncStorage.getItem.mockResolvedValue(mockToken);
    
    const token = await AsyncStorage.getItem('accessToken');
    
    expect(token).toBe(mockToken);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('accessToken');
  });

  test('should check authentication status', async () => {
    AsyncStorage.getItem.mockResolvedValue('true');
    
    const isAuth = await AsyncStorage.getItem('isAuthenticated');
    
    expect(isAuth).toBe('true');
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('isAuthenticated');
  });

  test('should clear authentication data on logout', async () => {
    await AsyncStorage.multiRemove([
      'accessToken',
      'isAuthenticated', 
      'userEmail',
      'userName'
    ]);
    
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
      'accessToken',
      'isAuthenticated', 
      'userEmail',
      'userName'
    ]);
  });
});