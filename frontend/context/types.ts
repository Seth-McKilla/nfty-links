import { Dispatch } from "react";

export interface AuthInterface {
  token: string;
  loading: boolean;
  error: string | null;
}

export interface ReducersInterface {
  auth: AuthInterface;
}

export interface ContextInterface {
  state: ReducersInterface;
  dispatch: Dispatch<{ type: string; payload: ReducersInterface }>;
}
