import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Layout, Loader, Button } from "../components";

const Home: NextPage = () => {
  const [{ loading, error }] = useAccount();

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
        <h1 className="mb-4 text-4xl font-bold">Welcome to Nfty Link!</h1>
        <h3 className="mb-8 text-2xl">Placeholder for value proposition.</h3>
        <div className="flex">
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
