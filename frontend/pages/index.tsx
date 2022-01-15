import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import useAuthLogin from "../hooks/useAuthLogin";
import { Layout, Loader, Button } from "../components";

const Home: NextPage = () => {
  const [{ data: accountData, loading: accountLoading }] = useAccount();
  const {
    text,
    loading: loginLoading,
    error,
  } = useAuthLogin(accountData?.address);

  const loading = accountLoading || loginLoading;

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
        <h1 className="mb-4 text-4xl font-bold">Welcome to Nfty Links!</h1>
        <h3 className="mb-8 text-2xl">Placeholder for value proposition.</h3>
        <Link href="/nfts/create" passHref>
          <a>
            <Button>Create NFT</Button>
          </a>
        </Link>
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
