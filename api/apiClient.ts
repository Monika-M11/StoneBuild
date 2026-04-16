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


// import * as SecureStore from 'expo-secure-store';

// const TOKEN_KEY = 'user_jwt_token';

// export const postApi = async (
//   endpoint: string,
//   data: any
// ) => {
//   try {
//     // ✅ Get JWT (if exists)
//     const jwt = await SecureStore.getItemAsync(TOKEN_KEY);

//     const response = await fetch(`${BASE_URL}${endpoint}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         ...(jwt && { Authorization: `Bearer ${jwt}` }),
//       },
//       body: JSON.stringify({
//         data: data, // ✅ consistent payload
//       }),
//     });

//     // ✅ safer parsing (handles non-JSON too)
//     const text = await response.text();

//     try {
//       const result = JSON.parse(text);
//       return { ...result, httpStatus: response.status };
//     } catch {
//       return {
//         status: 'error',
//         message: text,
//         httpStatus: response.status,
//       };
//     }

//   } catch (error: any) {
//     return {
//       status: 'error',
//       message: error?.message || 'Network error',
//       httpStatus: 0,
//     };
//   }
// };


// import { getToken } from '@/auth/authStorage';
// import * as SecureStore from 'expo-secure-store';

// const TOKEN_KEY = 'user_jwt_token';

// export const postApi = async (
//   endpoint: string,
//   data: any
// ) => {
//   try {
//     // ✅ Use your clean getToken helper
//     const jwt = await getToken();

//     console.log(`📤 API Call → ${endpoint}`);

//     const response = await fetch(`${BASE_URL}${endpoint}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         ...(jwt && { Authorization: `Bearer ${jwt}` }),   // ← This stays exactly as you wanted
//       },
//       body: JSON.stringify({
//         data: data,        // ← Wrapper that works for both login & add-contact
//       }),
//     });

//     const text = await response.text();
//     console.log(`📥 Raw Response from ${endpoint}:`, text.substring(0, 300)); // limit log size

//     try {
//       const result = JSON.parse(text);
//       const finalResult = { ...result, httpStatus: response.status };

//       console.log(`✅ Success Response:`, finalResult);
//       return finalResult;

//     } catch {
//       return {
//         status: 'error',
//         message: text || 'Invalid server response',
//         httpStatus: response.status,
//       };
//     }
//   } catch (error: any) {
//     console.error(`❌ Network Error on ${endpoint}:`, error?.message || error);

//     return {
//       status: 'error',
//       message: error?.message || 'Network request failed',
//       httpStatus: 0,
//     };
//   }
// };

import * as SecureStore from 'expo-secure-store';

export const postApi = async (endpoint: string, data: any) => {
  if (!endpoint || endpoint === 'undefined') {
    console.warn(`⚠️ Invalid endpoint "${endpoint}", using fallback '/add-contact'`);
    endpoint = '/add-contact';
  }
  const TOKEN_KEY = 'user_jwt_token';
  try {
    const jwt = await SecureStore.getItemAsync(TOKEN_KEY);
    const fullUrl = `${BASE_URL}${endpoint}`;

    console.log(`🚀 Requesting: ${fullUrl}`);
    console.log(`📤 Payload:`, JSON.stringify(data, null, 2));

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(jwt && { Authorization: `Bearer ${jwt}` }),
      },
      body: JSON.stringify({ data: data }),
      signal: controller.signal,
    });
     console.log('🔑 JWT USED:', jwt);
    clearTimeout(timeout);

    console.log(`📥 Status: ${response.status} ${response.statusText}`);

    const text = await response.text();
    console.log(`📥 Response body:`, text);

    try {
      const result = JSON.parse(text);
      return { ...result, httpStatus: response.status };
    } catch {
      return { status: 'error', message: text, httpStatus: response.status };
    }
  } catch (error: any) {
    console.error('❌ FULL ERROR DETAILS:');
    console.error('Error Name:', error?.name);
    console.error('Error Message:', error?.message);
    console.error('Error Stack:', error?.stack);

    if (error?.name === 'AbortError') {
      return { status: 'error', message: 'Request timed out (tunnel too slow)', httpStatus: 0 };
    }

    return {
      status: 'error',
      message: error?.message || 'Network request failed',
      httpStatus: 0,
    };
  }
};