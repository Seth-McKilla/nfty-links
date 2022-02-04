import { createContext, useReducer, ReactNode } from "react";
import reducers from "./reducers";
import { AuthInterface, ContextInterface } from "./types";

const initialState: AuthInterface = {
  token: "",
  loading: false,
  error: null,
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
