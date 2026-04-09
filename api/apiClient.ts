import { BASE_URL } from './endpoints';

export const postApi = async (
  endpoint: string,
  token: string,
  data: any
) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Token: token,
        Data: data,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'API Error');
    }

    return result;
  } catch (error: any) {
    throw error;
  }
};