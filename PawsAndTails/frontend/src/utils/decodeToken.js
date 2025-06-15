import { jwtDecode } from "jwt-decode";

export const decodeToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      console.warn("Token expired");
      localStorage.removeItem("token");
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Invalid token");
    localStorage.removeItem("token");
    return null;
  }
};
