import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'user_jwt_token';

// Called after login — saves the token into the phone's secure hardware
export const saveToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};
// Called on app start — reads the token back from secure storage
export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};
// Called on logout — deletes the token completely
export const removeToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};