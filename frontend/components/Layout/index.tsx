import Head from "next/head";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { Button, MenuDropdown, WalletOptionsModal, SideNav } from "..";
import { useAccount } from "wagmi";

interface Props {
  children: ReactNode;
  showSideNav?: boolean;
}

export default function Layout({ children, showSideNav = true }: Props) {
  const [showWalletOptions, setShowWalletOptions] = useState(false);

  const [{ data: accountData, loading }, disconnect] = useAccount({
    fetchEns: true,
  });

  const renderLabel = () => {
    if (accountData?.ens) {
      return (
        <>
          <div className="relative w-8 h-8 mr-2">
            {accountData.ens.avatar ? (
              <Image
                src={accountData?.ens.avatar}
                alt="ENS Avatar"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            ) : (
              <Image
                src="/images/black-gradient.png"
                alt="ENS Avatar"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            )}
          </div>
          <span className="truncate max-w-[100px]">
            {accountData.ens?.name}
          </span>
        </>
      );
    }

    return (
      <span className="truncate max-w-[150px]">{accountData?.address}</span>
    );
  };

  const renderButton = () => {
    if (accountData) {
      return (
        <MenuDropdown
          label={renderLabel()}
          options={[{ label: "Disconnect", onClick: disconnect }]}
        />
      );
    }

    return (
      <Button
        loading={loading || showWalletOptions}
        onClick={() => setShowWalletOptions(true)}
      >
        Connect
      </Button>
    );
  };

  return (
    <div>
      <Head>
        <title>Nft Link</title>
        <meta name="description" content="NextJS and wagmi template" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WalletOptionsModal
        open={showWalletOptions}
        setOpen={setShowWalletOptions}
      />

      <div className="fixed w-screen bg-gradient-to-r from-white via-purple-500 to-pink-500 lg:pl-60 place-items-right">
        <div className="flex justify-end p-4">{renderButton()}</div>
      </div>

      {showSideNav && <SideNav />}

      <div className={`w-screen h-screen ${showSideNav && "lg:pl-60"}`}>
        {children}
      </div>
    </div>
  );
}
