import { useState, useEffect, useRef } from "react";
const { NEXT_PUBLIC_API_URL } = process.env;

export default function useAuthLogin(address: string | undefined) {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    const login = async () => {
      if (!address || !isMounted.current) return;
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${NEXT_PUBLIC_API_URL}auth/login?publicAddress=${address}`
        );
        const text = await response.text();
        setText(text);
        console.log(text);
      } catch (error: any) {
        console.error(error);
        setError(error?.message);
      }

      return setLoading(false);
    };

    login();

    return () => {
      isMounted.current = false;
    };
  }, [address]);

  return { text, loading, error };
}
