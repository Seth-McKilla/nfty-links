import type { NextPage } from "next";
import { useAccount } from "wagmi";
import useAuthLogin from "../hooks/useAuthLogin";
import { Layout, Loader } from "../components";

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
          <h1 className="text-4xl">Error</h1>
          <p className="text-2xl">{error}</p>
        </>
      );

    if (!text) {
      return (
        <>
          <h1 className="mb-4 text-4xl font-bold">Welcome to Nfty Links!</h1>
          <h3 className="mb-8 text-2xl">Placeholder for value proposition.</h3>
        </>
      );
    }

    return (
      <>
        <h1 className="mb-8 text-4xl font-bold">Login Data</h1>
        <div className="inline-flex place-items-center">
          <h6 className="ml-2 text-2xl">{text}</h6>
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
