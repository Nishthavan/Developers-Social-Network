import uid from "uuid";
import {SET_ALERT,REMOVE_ALERT} from "./constants";
export const setAlert = (msg,alertType) => dispatch () => {
  const id = uid.v4();
  dispatch({
    type: SET_ALERT,
    payload: {msg,alertType,id}
  });
};
