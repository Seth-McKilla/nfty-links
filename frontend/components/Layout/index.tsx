import Head from "next/head";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { Button, MenuDropdown, WalletOptionsModal } from "..";
import { useAccount } from "wagmi";
import Link from "next/link";

export default function Layout({ children }: { children: ReactNode }) {
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
        <title>Nfty Link</title>
        <meta name="description" content="NextJS and wagmi template" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WalletOptionsModal
        open={showWalletOptions}
        setOpen={setShowWalletOptions}
      />

      <div className="absolute w-screen bg-gradient-to-r from-white via-purple-500 to-pink-500">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Link href="/" passHref>
              <Image src="/images/nftlink.png" alt="Nfty Link" layout={'fixed'} width={'100%'} height={'70%'}/>
            </Link>
          </div>
          {renderButton()}
        </div>
      </div>
      {children}
    </div>
  );
}
