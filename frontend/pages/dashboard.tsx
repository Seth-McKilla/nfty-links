import type { NextPage } from "next";
import { useContext } from "react";
import { Context } from "../context";
import { Layout } from "../components";

const Dashboard: NextPage = () => {
  const { state } = useContext(Context);
  console.log(state);

  return (
    <Layout>
      <div className="grid h-screen place-items-center">
        <div className="grid place-items-center">Logged in</div>
      </div>
    </Layout>
  );
};

export default Dashboard;
