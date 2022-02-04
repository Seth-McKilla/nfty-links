import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";
import { Context } from "../context";
import { Layout, Loader, Button } from "../components";
import { ImportOptionsModal, WalletOptionsModal } from "../components";

const Home: NextPage = () => {
  const { push } = useRouter();
  const { state } = useContext(Context);
  const { token, loading, error } = state;

  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");
  const [showWalletOptions, setShowWalletOptions] = useState<boolean>(false);
  const [showMarketplacesModal, setShowMarketplacesModal] =
    useState<boolean>(false);

  const renderContent = () => {
    if (loading) return <Loader size={8} />;

    if (error)
      return (
        <>
          <h1 className="mb-3 text-4xl">Oops!</h1>
          <p className="text-xl text-red-500">{`Error: ${error}`}</p>
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

  useEffect(() => {
    if (token) push("/dashboard");
  }, [push, token]);

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
