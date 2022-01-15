import { NextPage } from "next";
import { Layout } from "../../components";

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="grid h-screen place-items-center">
        <div className="grid place-items-center">{"NFT's"}</div>
      </div>
    </Layout>
  );
};

export default Home;
