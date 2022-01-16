import Link from "next/link";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { Layout, Loader, Button } from "../components";
import useAuthLogin from "../hooks/useAuthLogin";
import { ImportOptionsModal, Modal } from "../components";

const { NEXT_PUBLIC_API_URL } = process.env;

const Home: NextPage = () => {
  // Hooks
  const [{ data: accountData, error: accountError, loading: accountLoading }] =
    useAccount();
  const { text, loading: authLoading } = useAuthLogin(accountData?.address);
  const [_, signMessage] = useSignMessage();

  // Local State
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");
  const [authToken, setAuthToken] = useState<string>("");
  const [showMarketplacesModal, setShowMarketplacesModal] =
    useState<boolean>(false);
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);

  const getAuthToken = async () => {
    if (!accountData?.address) return setShowConnectModal(true);
    setLoginLoading(true);

    try {
      const { data: sig } = await signMessage({ message: text });
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
      const token = await response.text();

      localStorage.setItem("token", token);
      setAuthToken(token);
    } catch (error: any) {
      console.error(error);
      setLoginError(error?.message);
    }

    return setLoginLoading(false);
  };

  useEffect(() => {
    let token = localStorage.getItem("token");
    token && setAuthToken(token.toString());
  }, [accountData?.address]);

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken("");
  };

  const renderContent = () => {
    if (accountLoading || authLoading) return <Loader size={8} />;

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
              <div className="mr-6">
                <Link href="/nfts/create" passHref>
                  <a>
                    <Button>Create NFT</Button>
                  </a>
                </Link>
              </div>
              <div>
                <Button onClick={() => setShowMarketplacesModal(true)}>
                  Import NFT
                </Button>
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
          {loginError && <p className="text-sm text-red-500">{loginError}</p>}
        </div>
      </>
    );
  };

  return (
    <Layout>
      {showMarketplacesModal && (
        <ImportOptionsModal
          open={showMarketplacesModal}
          setOpen={setShowMarketplacesModal}
        />
      )}
      {showConnectModal && (
        <Modal open={showConnectModal}>
          <div className="p-4 text-center">
            <h1 className="mb-4 text-4xl font-bold">Connect Wallet</h1>
            <p className="text-xl">Please connect your wallet to continue.</p>
            <div className="flex items-center justify-end p-3 mt-1">
              <button
                className="px-6 py-2 mb-1 text-sm font-semibold text-red-500 uppercase"
                type="button"
                onClick={() => setShowConnectModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      <div className="grid h-screen place-items-center">
        <div className="grid place-items-center">{renderContent()}</div>
      </div>
    </Layout>
  );
};

export default Home;
