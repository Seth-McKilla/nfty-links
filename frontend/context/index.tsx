import { createContext, useReducer, ReactNode } from "react";
import Cookies from "js-cookie";
import reducers from "./reducers";
import { ReducersInterface, ContextInterface } from "./types";

const initialState: ReducersInterface = {
  auth: { token: Cookies.get("token") ?? "", loading: false, error: null },
};

export const Context = createContext<ContextInterface>({
  state: initialState,
  dispatch: () => null,
});

export const Provider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducers, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};
