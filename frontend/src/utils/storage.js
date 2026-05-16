const PREFIX = 'midspace_';

export const KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
};

function prefixed(key) {
  return `${PREFIX}${key}`;
}

export function getToken(key) {
  try {
    return localStorage.getItem(prefixed(key));
  } catch {
    return null;
  }
}

export function setToken(key, value) {
  try {
    localStorage.setItem(prefixed(key), value);
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function removeToken(key) {
  try {
    localStorage.removeItem(prefixed(key));
  } catch (e) {
    console.error('Failed to remove from localStorage:', e);
  }
}

export function clearAll() {
  try {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(prefixed(key)));
  } catch (e) {
    console.error('Failed to clear localStorage:', e);
  }
}
