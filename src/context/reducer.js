import { SET_USER, SET_TEACHER } from "./action.types";

export default (state, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case SET_TEACHER:
      return { ...state, teacher: action.payload };

    default:
      return state;
  }
};
