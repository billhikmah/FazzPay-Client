import { getUserDataString, PENDING, FULFILLED, REJECTED, logoutString } from "../actionCreators/actionString";

const initialState = {
  isLoading: false,
  isError: null,
  message: "",
  userData: {}
}

const userDataReducer = (prevState = initialState, action) => {
  switch (action.type) {
    case getUserDataString + PENDING:
      return { ...initialState, isLoading: true, isError: null }
    case getUserDataString + FULFILLED:
      return {
        ...prevState,
        isLoading: false,
        isError: false,
        message: action.payload.data.msg,
        userData: action.payload.data.data
      }
    case getUserDataString + REJECTED:
      return {
        ...prevState,
        isLoading: false,
        isError: true,
        message: action.payload.data.msg
      }
    case logoutString:
      return initialState
    default:
      return prevState
  }
}

export default userDataReducer