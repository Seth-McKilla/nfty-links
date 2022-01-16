import { useRouter } from "next/router";
import { Button, Layout } from "../../components";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader, Modal } from "../../components";

const { NEXT_PUBLIC_API_URL } = process.env;

const ViewNFT = () => {
  const router = useRouter();
  const { uuid } = router.query;

  // Local State
  const [authToken, setAuthToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [claiming, setClaiming] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
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
    setLoading(true);
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
        setLoading(false);
      });
    });
  }, [uuid]);

  const claim = (uuid: string) => {
    setClaiming(true);
    fetch(`${NEXT_PUBLIC_API_URL}nft/${uuid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
    }).then((r) => {
      r.json().then((r) => {
        setNft(r);
        setClaiming(false);
        setShowSuccessModal(true)
      });
    });
  };

  return (
    <Layout>
      {showSuccessModal && (
        <Modal open={showSuccessModal}>
          <div className="p-4 text-center">
            <h1 className="mb-4 text-4xl font-bold">NFT Minted!</h1>
            <p className="text-xl">Successfully minted the NFT!</p>
            <div className="flex items-center justify-end p-3 mt-1">
              <button
                className="px-6 py-2 mb-1 text-sm font-semibold text-red-500 uppercase"
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  return router.push("/nfts");
                }}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
      <div className="grid h-screen place-items-center">
        {loading ? (
          <Loader size={8} />
        ) : (
          <div className="flex-col justify-items-center">
            <h3 className="text-2xl">
              You can claim the following nft: {uuid}
            </h3>
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
                      href={"https://nftlink.cc/nfts/" + nft.id}
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
                  loading={claiming}
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
        )}
      </div>
    </Layout>
  );
};

export default ViewNFT;
