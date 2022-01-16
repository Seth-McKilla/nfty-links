import Link from "next/link";
import type { NextPage } from "next";
import { useAccount, useSignMessage } from "wagmi";
import { Layout, Loader, Button } from "../components";
import useAuthLogin from "../hooks/useAuthLogin";

const { NEXT_PUBLIC_API_URL } = process.env;
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const [{ data: accountData, error: accountError, loading: accountLoading }] =
    useAccount();
  const { text } = useAuthLogin(accountData?.address);
  const [_, signMessage] = useSignMessage();
  const [authToken, setAuthToken] = useState("");

  const getAuthToken = async () => {
    if (!accountData?.address) return;
    setLoginLoading(true);

    try {
      const sig = await signMessage({ message: text });
      const response = await fetch(`${NEXT_PUBLIC_API_URL}auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: accountData?.address,
          sig,
        }),
      });
      const token = await response.json();

      localStorage.setItem("token", token);
      setAuthToken(token);
    } catch (error) {
      console.error(error);
    }

    return setLoginLoading(false);
  };

  useEffect(() => {
    let token = localStorage.getItem("token");
    token && setAuthToken(token.toString());
    console.log(token);
  }, [accountData?.address]);

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken("");
  };

  const renderContent = () => {
    if (accountLoading) return <Loader size={8} />;

    if (accountError)
      return (
        <>
          <h1 className="mb-3 text-4xl">Oops!</h1>
          <p className="text-xl text-red-500">{`Error: ${accountError?.message}`}</p>
        </>
      );

    return (
      <>
        <h1 className="mb-4 text-4xl font-bold">Welcome to NFT Link!</h1>
        <h3 className="mb-8 text-2xl">
          Embed an NFT into a url and send it to anyone
        </h3>
        <div className="flex">
          {authToken ? (
            <div className="flex">
              <div className="mr-6">
                <Button
                  onClick={() => {
                    logout();
                  }}
                >
                  {"Logout"}
                </Button>
              </div>
              <div className="mr-6">
                <Link href="/nfts" passHref>
                  <a>
                    <Button>{"View NFT's"}</Button>
                  </a>
                </Link>
              </div>
              <div className="ml-6">
                <Link href="/nfts/create" passHref>
                  <a>
                    <Button>Create NFT</Button>
                  </a>
                </Link>
              </div>
            </div>
          ) : (
            <div className="mr-6">
              <Button
                loading={loginLoading}
                onClick={() => {
                  getAuthToken();
                }}
              >
                {"Login"}
              </Button>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <Layout>
      <div className="grid h-screen place-items-center">
        <div className="grid place-items-center">{renderContent()}</div>
      </div>
    </Layout>
  );
};

export default Home;
