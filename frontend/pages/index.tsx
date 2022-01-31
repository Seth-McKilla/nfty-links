import type { NextPage } from "next";
import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { Layout, Loader, Button } from "../components";
import useAuthLogin from "../hooks/useAuthLogin";
import { ImportOptionsModal, WalletOptionsModal } from "../components";

const { NEXT_PUBLIC_API_URL } = process.env;

const Home: NextPage = () => {
  // Hooks
  const [{ data, error, loading }] = useAccount();
  const { text, loading: authLoading } = useAuthLogin(data?.address);
  const [_, signMessage] = useSignMessage();

  // Local State
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");
  const [showWalletOptions, setShowWalletOptions] = useState<boolean>(false);
  const [showMarketplacesModal, setShowMarketplacesModal] =
    useState<boolean>(false);

  const getAuthToken = async () => {
    setLoginLoading(true);

    try {
      const { data: sig } = await signMessage({ message: text });
      const response = await fetch(`${NEXT_PUBLIC_API_URL}auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: data?.address,
          sig,
        }),
      });
      const token = await response.text();

      localStorage.setItem("token", token);
    } catch (error: any) {
      console.error(error);
      setLoginError(error?.message);
    }

    return setLoginLoading(false);
  };

  const renderContent = () => {
    if (loading || authLoading) return <Loader size={8} />;

    if (error)
      return (
        <>
          <h1 className="mb-3 text-4xl">Oops!</h1>
          <p className="text-xl text-red-500">{`Error: ${error?.message}`}</p>
        </>
      );

    return (
      <>
        <h1 className="mb-4 text-4xl font-bold">Welcome to NFT Link!</h1>
        <h3 className="mb-8 text-2xl">
          Embed an NFT into a url and send it to anyone
        </h3>
        <div className="flex">
          <div className="mr-6">
            <Button
              loading={loginLoading}
              onClick={() => setShowWalletOptions(true)}
            >
              Connect
            </Button>
          </div>
          {loginError && <p className="text-sm text-red-500">{loginError}</p>}
        </div>
      </>
    );
  };

  return (
    <Layout showSideNav={false}>
      <ImportOptionsModal
        open={showMarketplacesModal}
        setOpen={setShowMarketplacesModal}
      />

      <WalletOptionsModal
        open={showWalletOptions}
        setOpen={setShowWalletOptions}
      />

      <div className="grid h-screen place-items-center">
        <div className="grid place-items-center">{renderContent()}</div>
      </div>
    </Layout>
  );
};

export default Home;
