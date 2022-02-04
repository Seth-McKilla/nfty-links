import { Dispatch } from "react";

export interface AuthInterface {
  token?: string;
  loading?: boolean;
  error?: string | null;
}

export interface ContextInterface {
  state: AuthInterface;
  dispatch: Dispatch<{ type: string; payload: AuthInterface }>;
}
