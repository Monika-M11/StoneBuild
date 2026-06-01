// auth/authManager.ts

let logoutCallback: (() => void) | null = null;

export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

export const triggerLogout = () => {
  logoutCallback?.();
};