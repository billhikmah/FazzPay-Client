import { FULFILLED, loginString, logoutString, PENDING, REJECTED } from "../actionCreators/actionString";

const initialState = {
  isLoading: false,
  isError: null,
  message: "",
  data: {}
}

const authReducer = (prevState = initialState, action) => {
  switch (action.type) {
    case loginString + PENDING:
      return { ...initialState, isLoading: true, isError: null }
    case loginString + FULFILLED:
      return {
        ...prevState,
        isLoading: false,
        isError: false,
        message: action.payload.data.msg,
        data: action.payload.data.data
      }
    case loginString + REJECTED:
      return {
        ...prevState,
        isLoading: false,
        isError: true,
        message: action.payload.response.data.msg
      }
    case logoutString:
      return initialState
    default:
      return prevState
  }
}

export default authReducer