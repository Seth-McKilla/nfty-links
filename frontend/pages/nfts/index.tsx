import Image from "next/image";
import {NextPage} from "next";
import {Button, Layout} from "../../components";
import {useEffect, useState} from "react";
import Link from "next/link";
const {NEXT_PUBLIC_API_URL} = process.env;

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
    const [nfts, setNfts] = useState([{
      address: "",
      claimed: "",
      creator: "",
      description: "",
      id: "",
      image: "",
      name: "",
      receiver: ""
    }]);
    const [authToken, setAuthToken] = useState('')

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token);
        const response = fetch(
          `${NEXT_PUBLIC_API_URL}nfts`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
          }
        );
        response.then(res => res.json()).then(res => {
          if (res.error) {
            console.log(res.error);
          } else {
            setNfts(res);
          }
        });
      }
    }, []);

    return (
      <Layout>
        <div className="grid p-32">
          <div className="mr-6">
            <Link href="/" passHref>
              <a>
                <Button>{"Return Home"}</Button>
              </a>
            </Link>
          </div>
          <h1 className="grid text-4xl place-items-center">{"My NFT's"}</h1>
          <div className="grid grid-cols-1 gap-5 p-10 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2">
            {nfts?.map((nft, idx) => (
              <div
                key={`${idx}-${nft.address}`}
                className="overflow-hidden rounded-md shadow-xl"
              >
                {nft.image.startsWith('http') && <Image
                    src={nft.image}
                    alt={nft.name}
                    width="100%"
                    height="100%"
                    layout="responsive"
                    objectFit="contain"
                />}
                <div className="px-2 py-2">
                  <div className="mb-2 text-xl font-bold">{nft.name}</div>
                  <p className="text-base text-gray-700"><b>Description: </b>{nft.description}</p>
                  <p className="text-base text-gray-700"><b>Creator: </b>{nft.creator}</p>
                  <p className="text-base text-gray-700"><b>Claimed: </b>{nft.claimed.toString()}</p>
                  {nft.receiver && <p className="text-base text-gray-700"><b>Receiver: </b>  {nft.receiver}</p>}
                  {nft.address && <p className="text-base text-gray-700"><b>Address: </b>  {nft.address}</p>}
                  {nft.id && <p className="text-base text-gray-700"><b>Claim ID: </b>  {nft.id}</p>}
                  {nft.image && <p className="text-base text-gray-700"><b>Image: </b>  {nft.image}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }
;

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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}nfts`);
    nfts = await response.json();

    return {
      props: {nfts, error: null},
    };
  } catch (error: any) {
    console.error(error);
    return {props: {nfts, error: error?.message}};
  }
}

export default Home;
