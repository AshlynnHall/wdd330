import jwt_decode from "jwt-decode";
import { loginRequest } from "./externalServices.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const tokenKey = "so-token";

export async function login(creds, redirect = "/") {
    try {
        const token = await loginRequest(creds);
        setLocalStorage(tokenKey, token);
        window.location = redirect;
    } catch (err) {
        alert(err.message || "Login failed");
    }
}

export function isTokenValid(token) {
    if (token) {
        const decoded = jwt_decode(token);
        let currentDate = new Date();
        if (decoded.exp * 1000 < currentDate.getTime()) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

export function checkLogin() {
    const token = getLocalStorage(tokenKey);
    const valid = isTokenValid(token);
    
    if (!valid) {
        localStorage.removeItem(tokenKey);
        const location = window.location;
        window.location = `/login/index.html?redirect=${location.pathname}`;
    } else {
        return token;
    }
}
