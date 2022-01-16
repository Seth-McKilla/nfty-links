import Link from "next/link";
import type {NextPage} from "next";
import {useAccount, useSignMessage} from "wagmi";
import {Layout, Loader, Button} from "../components";
import useAuthLogin from "../hooks/useAuthLogin";

const {NEXT_PUBLIC_API_URL} = process.env;
import {verifyMessage} from 'ethers/lib/utils'
import {useEffect, useState} from "react";
import Image from "next/image";


const Home: NextPage = () => {
  const [{loading, error, data}] = useAccount();
  const authLogin = useAuthLogin(data?.address);
  const [signMessageHook, signMessage] = useSignMessage()
  const [authToken, setAuthToken] = useState('')

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
    let token = localStorage.getItem("token");
    token && setAuthToken(token.toString());
    console.log(token);
  }, [data?.address]);

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken('');
  };

  const renderContent = () => {
    if (loading) return <Loader size={8}/>;

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
        <h3 className="mb-8 text-2xl">Embed a NFT into a url and send it to anyone</h3>
        <div className="flex">
          {authToken == '' && <div className="mr-6">
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
                          <Button>Create NFT</Button>
                      </a>
                  </Link>
              </div>
          </div>
          }
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
