import { LOGIN, LOGOUT } from "./constants";
import { AuthInterface, ReducersInterface } from "./types";

const combineReducers =
  (...reducers: any) =>
  (
    state: ReducersInterface,
    action: { type: string; payload: ReducersInterface }
  ) => {
    for (let i = 0; i < reducers.length; i++)
      state = reducers[i](state, action);
    return state;
  };

const authReducer = (
  state: AuthInterface,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case LOGIN["REQUEST"]:
      return { ...state, loading: true };
    case LOGIN["SUCCESS"]:
      return { ...state, token: action.payload, loading: false };
    case LOGIN["FAIL"]:
      return { ...state, error: action.payload, loading: false };

    case LOGOUT["REQUEST"]:
      return { ...state, loading: true };
    case LOGOUT["SUCCESS"]:
      return { ...state, token: "", loading: false };
    case LOGOUT["FAIL"]:
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

const reducers = combineReducers({
  auth: authReducer,
});

export default reducers;
