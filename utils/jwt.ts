import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp?: number;
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp) {
      return true;
    }

    const currentTime = Date.now() / 1000;

    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const getTokenExpiry = (token: string): number | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    return decoded.exp || null;
  } catch {
    return null;
  }
};