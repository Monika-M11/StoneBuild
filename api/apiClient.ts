import { BASE_URL } from './endpoints';

// export const postApi = async (
//   endpoint: string,
//   token: string,
//   data: any
// ) => {
//   try {
//     const response = await fetch(`${BASE_URL}${endpoint}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         Token: token,
//         Data: data,
//       }),
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result.message || 'API Error');
//     }

//     return result;
//   } catch (error: any) {
//     throw error;
//   }
// };

// export const postApi = async (
//   endpoint: string,
//   token: string,
//   data: any
// ) => {
//   try {
//     const response = await fetch(`${BASE_URL}${endpoint}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
        
//       },
//       body: JSON.stringify({
//         Token: token,
//         Data: data,
//       }),
//     });

//     const text = await response.text(); // ✅ read raw response first

//     let result;

//     try {
//       result = JSON.parse(text); // try parse JSON
//     } catch (e) {
//       console.log('RAW RESPONSE (NOT JSON):', text); // 🔥 important
//       throw new Error('Invalid server response (not JSON)');
//     }

//     if (!response.ok) {
//       throw new Error(result?.message);
//     }

//     return result;
//   } catch (error: any) {
//     throw error;
//   }
// };

// export const postApi = async (
//   endpoint: string,
//   token: string,
//   data: any
// ) => {
//   try {
//     const response = await fetch(`${BASE_URL}${endpoint}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         Token: token,
//         Data: data,
//       }),
//     });

//     const text = await response.text();

//     let result;

//     try {
//       // ✅ Try parsing JSON
//       result = JSON.parse(text);

//       return {
//         ...result,
//         httpStatus: response.status,
//       };

//     } catch (e) {
//       // ✅ If NOT JSON → treat as plain text message
//       console.log('RAW TEXT RESPONSE:', text);

//       return {
//         status: false,
//         message: text, // 🔥 THIS IS YOUR FIX
//         httpStatus: response.status,
//       };
//     }

//   } catch (error: any) {
//     return {
//       status: false,
//       message: error?.message || 'Network error',
//       httpStatus: 0,
//     };
//   }
// };

import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'user_jwt_token';

export const postApi = async (
  endpoint: string,
  token: string,
  data: any
) => {
  try {
    // ✅ Attach JWT from secure storage
    const jwt = await SecureStore.getItemAsync(TOKEN_KEY);

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(jwt && { Authorization: `Bearer ${jwt}` }),
      },
      body: JSON.stringify({
        Token: token,
        Data: data,
      }),
    });

    const text = await response.text();

    try {
      const result = JSON.parse(text);
      return { ...result, httpStatus: response.status };
    } catch (e) {
      return {
        status: false,
        message: text,
        httpStatus: response.status,
      };
    }
  } catch (error: any) {
    return {
      status: false,
      message: error?.message || 'Network error',
      httpStatus: 0,
    };
  }
};