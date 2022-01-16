import { NextPage } from "next";
import { Layout } from "../../components";

type NFT = {
  name: string;
  description: string;
  image: string;
};

interface Props {
  nfts: NFT[];
  error: string;
}

const Home: NextPage<Props> = (props) => {
  const { nfts, error } = props;
  console.log(nfts);

  return (
    <Layout>
      <div className="grid p-32">
        <h1 className="grid text-4xl place-items-center">{"My NFT's"}</h1>
        {nfts?.map((nft, idx) => (
          <div key={`${idx}`}>Placeholder</div>
        ))}
      </div>
    </Layout>
  );
};

export async function getStaticProps() {
  let nfts = [];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nfts`);
    nfts = await response.json();

    return {
      props: { nfts },
    };
  } catch (error: any) {
    console.error(error);
    return { props: { error: error?.message } };
  }
}

export default Home;
