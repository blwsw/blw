import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getTokenData(key) {
  return Cookies.get(key)
}

export function setTokenData(key,value) {
  return Cookies.set(key, value)
}

export function removeTokenData(key) {
  return Cookies.remove(key)
}
