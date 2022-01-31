import { createContext, useReducer, ReactNode, Dispatch } from "react";

interface ContextInterface {
  token: string;
}

const initialState: ContextInterface = {
  token: localStorage.get("token") ?? "",
};

// Reducer
const reducer = (
  state: ContextInterface,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "LOGIN":
      return { token: action.payload };
    case "LOGOUT":
      return { token: "" };
    default:
      return state;
  }
};

// Actions
export const login = (token: string) => {
  localStorage.set("token", token);
  return {
    type: "LOGIN",
    payload: token,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  return {
    type: "LOGOUT",
  };
};

// Context
export const Context = createContext<{
  state: ContextInterface;
  dispatch: Dispatch<{ type: string; payload: ContextInterface }>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Provider
export const Provider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};
