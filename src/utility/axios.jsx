import axios from "axios";

export const doLogin = (body) => {
  return axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}/auth/login`, body)
}

export const getUserData = (id, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } }
  return axios.get(`${process.env.NEXT_PUBLIC_BE_HOST}/user/profile/${id}`, config)
}