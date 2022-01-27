import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Layout, Loader, NFTCard, NFTCardProps } from "../../components";

const { NEXT_PUBLIC_API_URL } = process.env;

const Home: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [nfts, setNfts] = useState<NFTCardProps[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFTCardProps[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setFilteredNfts(nfts);
  }, [nfts]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;

    setSearch(search);
    setFilteredNfts(
      nfts.filter((nft: NFTCardProps) =>
        nft.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  useEffect(() => {
    let mounted = true;

    const fetchNFTs = async () => {
      if (!mounted) return;
      setLoading(true);

      try {
        const response = await fetch(`${NEXT_PUBLIC_API_URL}nfts`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        const nfts = await response.json();

        setNfts(nfts);
      } catch (error: any) {
        console.error(error);
        setError(error.message);
      }

      return setLoading(false);
    };

    fetchNFTs();

    return () => {
      mounted = false;
    };
  }, []);

  const renderContent = () => {
    if (loading) return <Loader size={8} />;
    if (error) return <p className="text-red-500 text-md">{error}</p>;

    return (
      <div className="grid grid-cols-1 gap-5 p-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredNfts.map((props: NFTCardProps, idx) => (
          <NFTCard key={`${idx}-${props.image}`} {...props} />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="grid p-32">
        <h1 className="grid mb-8 text-4xl place-items-center">{"My NFT's"}</h1>
        <div className="flex justify-center w-full pt-0 mb-3">
          <input
            type="text"
            placeholder="Search NFT by name..."
            className="w-full px-3 py-3 text-sm text-center bg-white border-0 border-2 rounded shadow w-80 placeholder-black-500 text-black-800 focus:outline-none focus:ring"
            onChange={handleSearch}
            value={search}
          />
        </div>
        {renderContent()}
      </div>
    </Layout>
  );
};

export default Home;
