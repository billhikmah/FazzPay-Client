import { getUserData } from "../../utility/axios";
import { getUserDataString } from "./actionString";

export const getUserDataAction = (id, token) => ({
  type: getUserDataString,
  payload: getUserData(id, token)
})