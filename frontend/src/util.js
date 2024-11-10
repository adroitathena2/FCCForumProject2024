import Cookies from "js-cookie";

export function checkAuth() {
    if (!Cookies.get("username") || !Cookies.get("session")) return false;
    return ((Cookies.get("username") !== "") && (Cookies.get("session") !== ""));
}

export function getUsername() {
    return Cookies.get("username");
}