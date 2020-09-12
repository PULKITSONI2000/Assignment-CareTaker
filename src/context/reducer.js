import {
  SET_USER,
  SET_TEACHER,
  SET_CLASSES,
  ADD_CLASSES,
} from "./action.types";

export default (state, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case SET_TEACHER:
      return { ...state, teacher: action.payload };
    case SET_CLASSES:
      return { ...state, classes: action.payload };
    case ADD_CLASSES:
      state.classes.push(action.payload);
      return { ...state, classes: state.classes };

    default:
      return state;
  }
};
