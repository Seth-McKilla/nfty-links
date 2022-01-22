import Link from "next/link";
import type { NextPage } from "next";
import { useState } from "react";
import { useAccount } from "wagmi";
import { Layout, Loader, Button } from "../components";
import { ImportOptionsModal, WalletOptionsModal } from "../components";

const Home: NextPage = () => {
  // Hooks
  const [{ data: accountData, error: accountError, loading: accountLoading }] =
    useAccount();

  // Local State
  const [showMarketplacesModal, setShowMarketplacesModal] =
    useState<boolean>(false);
  const [showWalletOptions, setShowWalletOptions] = useState<boolean>(false);

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
          {accountData?.address ? (
            <div className="flex">
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
                loading={showWalletOptions}
                onClick={() => setShowWalletOptions(true)}
              >
                Connect
              </Button>
            </div>
          )}
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
