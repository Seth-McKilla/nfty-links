import {useRouter} from 'next/router'
import {Button, Layout} from "../../components";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useAccount, useSignMessage} from "wagmi";
import useAuthLogin from "../../hooks/useAuthLogin";
import Image from "next/image";

const {NEXT_PUBLIC_API_URL} = process.env;

const ViewNFT = () => {
  const router = useRouter()
  const {uuid} = router.query
  const [{loading, error, data}] = useAccount();
  const authLogin = useAuthLogin(data?.address);
  const [signMessageHook, signMessage] = useSignMessage()
  const [authToken, setAuthToken] = useState('')
  const [nft, setNft] = useState({
    address: "",
    claimed: "",
    creator: "",
    description: "",
    id: "",
    image: "",
    name: "",
    receiver: ""
  });

  const getAuthToken = () => {
    console.log('getAuthToken')
    if (data?.address) {
      authLogin.text && signMessage({message: authLogin.text}).then(r => {
        const response = fetch(
          `${NEXT_PUBLIC_API_URL}auth/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              address: data?.address,
              sig: r.data,
            }),
          }
        );
        response.then(r => {
          const token = r.text().then(r => {
            localStorage.setItem("token", r);
            console.log(r);
            setAuthToken(r);
          });
        });
      });
    }
  };

  useEffect(() => {
    if (uuid === undefined) {
      return;
    }
    let token = localStorage.getItem("token");
    token && setAuthToken(token.toString());
    console.log("HELLO: "  + uuid);
    // retrieve nft metadata
    fetch(`${NEXT_PUBLIC_API_URL}nft/${uuid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    }).then(r => {
      r.json().then(r => {
        setNft(r);
      });
    });
    }, [ uuid]);

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken('');
  };


  const claim = () => {
    console.log('claim')
  }

  return (
    <Layout>
      <div className="grid h-screen place-items-center">
        <h1 className="mt-16 text-4xl font-bold">Welcome to Nfty Link!</h1>
        <h3 className="text-2xl">You can claim the following nft: {uuid}</h3>
        <div>
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
        <div>
          {authToken && <Button onClick={() => {
            claim()
          }}
          >{"Claim"}
          </Button>}
        </div>
        <div className="flex">
          {authLogin.loading && authToken == '' && <div className="mr-6">
              <Button onClick={() => {
                getAuthToken()
              }}>{"Login"}</Button>
          </div>}
          {authToken != '' && <div className="flex">
              <div className="mr-6">
                  <Button onClick={() => {
                    logout()
                  }}>{"Logout"}</Button>
              </div>
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
                          <Button>Create your own NFT</Button>
                      </a>
                  </Link>
              </div>
          </div>
          }
        </div>
      </div>
    </Layout>
  )


}

export default ViewNFT