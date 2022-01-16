import Image from "next/image";
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

  return (
    <Layout>
      <div className="grid p-32">
        <h1 className="grid text-4xl place-items-center">{"My NFT's"}</h1>
        <div className="grid grid-cols-1 gap-5 p-10 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
          {nfts?.map((nft, idx) => (
            <div
              key={`${idx}-${nft.name}`}
              className="overflow-hidden rounded-md shadow-xl"
            >
              <Image
                src={nft.image}
                alt={nft.name}
                width="100%"
                height="100%"
                layout="responsive"
                objectFit="contain"
              />
              <div className="px-2 py-2">
                <div className="mb-2 text-xl font-bold">{nft.name}</div>
                <p className="text-base text-gray-700">{nft.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticProps() {
  let nfts = [
    {
      name: "Mountains",
      description:
        " Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, Nonea! Maiores et perferendis eaque, exercitationem praesentium nihil.",
      image:
        "https://cdn.pixabay.com/photo/2021/11/16/18/10/nature-6801719_960_720.jpg",
    },
  ];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nfts`);
    nfts = await response.json();

    return {
      props: { nfts, error: null },
    };
  } catch (error: any) {
    console.error(error);
    return { props: { nfts, error: error?.message } };
  }
}

export default Home;
