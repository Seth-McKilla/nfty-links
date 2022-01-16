import { useRouter } from "next/router";
import { Button, Layout } from "../../components";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import useAuthLogin from "../../hooks/useAuthLogin";
import Image from "next/image";

const { NEXT_PUBLIC_API_URL } = process.env;

const ViewNFT = () => {
  const router = useRouter();
  const { uuid } = router.query;
  const [{ loading, error, data }] = useAccount();
  const authLogin = useAuthLogin(data?.address);
  const [signMessageHook, signMessage] = useSignMessage();
  const [authToken, setAuthToken] = useState("");
  const [nft, setNft] = useState({
    address: "",
    claimed: "",
    creator: "",
    description: "",
    id: "",
    image: "",
    name: "",
    receiver: "",
    chain: "",
  });

  useEffect(() => {
    if (uuid === undefined) {
      return;
    }
    let token = localStorage.getItem("token");
    token && setAuthToken(token.toString());
    console.log("HELLO: " + uuid);
    // retrieve nft metadata
    fetch(`${NEXT_PUBLIC_API_URL}nft/${uuid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }).then((r) => {
      r.json().then((r) => {
        setNft(r);
      });
    });
  }, [uuid]);

  const claim = (uuid: string) => {
    fetch(`${NEXT_PUBLIC_API_URL}nft/${uuid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
    }).then((r) => {
      r.json().then((r) => {
        setNft(r);
        console.log("nft claimed");
      });
    });
  };

  return (
    <Layout>
      <div className="grid h-screen place-items-center">
        <div className="flex-col justify-items-center">
          <h3 className="text-2xl">You can claim the following nft: {uuid}</h3>
          <div>
            {nft.image.startsWith("http") && (
              <Image
                src={nft.image}
                alt={nft.name}
                width="100%"
                height="100%"
                layout="responsive"
                objectFit="contain"
              />
            )}
            <div className="px-2 py-2">
              <div className="mb-2 text-xl font-bold">
                <b>Name: </b>
                {nft.name}
              </div>
              {nft.id && (
                <p className="text-base text-gray-700">
                  <b>Link: </b>
                  <a
                    className="text-base text-purple-700"
                    href={"https://nfty-links.vercel.app/nfts/" + nft.id}
                  >
                    {nft.id}
                  </a>{" "}
                </p>
              )}
              <p className="text-base text-gray-700">
                <b>Description: </b>
                {nft.description}
              </p>
              <p className="text-base text-gray-700">
                <b>Creator: </b>
                {nft.creator}
              </p>
              <p className="text-base text-gray-700">
                <b>Claimed: </b>
                {nft.claimed.toString()}
              </p>
              {nft.receiver && (
                <p className="text-base text-gray-700">
                  <b>Receiver: </b> {nft.receiver}
                </p>
              )}
              {nft.address && (
                <p className="text-base text-gray-700">
                  <b>Address: </b> {nft.address}
                </p>
              )}
              {nft.id && (
                <p className="text-base text-gray-700">
                  <b>Claim ID: </b> {nft.id}
                </p>
              )}
              {nft.image && (
                <p className="text-base text-gray-700">
                  <b>Image: </b> {nft.image}
                </p>
              )}
              {nft.chain && (
                <p className="text-base text-gray-700">
                  <b>Chain: </b> {nft.chain}
                </p>
              )}
            </div>
          </div>
          <div>
            {authToken && (
              <Button
                disabled={!!nft.claimed}
                onClick={() => {
                  claim(nft.id);
                }}
              >
                {nft.claimed ? "Already claimed" : "Claim"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewNFT;
