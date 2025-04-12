import { ref, computed } from 'vue';
import { jwtDecode } from 'jwt-decode';

const token = ref(localStorage.getItem('token'));

const isLoggedIn = computed(() => token.value !== null);

const isAdmin = computed(() => {
  if (!token.value) return false;
  try {
    const decoded = jwtDecode(token.value);
    return decoded?.isAdmin === true;
  } catch {
    return false;
  }
});

const setToken = (newToken) => {
  token.value = newToken;
  if (newToken) {
    localStorage.setItem('token', newToken);
  } else {
    localStorage.removeItem('token');
  }
};

export function useAuth() {
  return {
    token,
    isLoggedIn,
    isAdmin,
    setToken,
  };
}
