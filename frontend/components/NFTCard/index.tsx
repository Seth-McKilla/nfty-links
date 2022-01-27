import Image from "next/image";

export type NFTCardProps = {
  image: string;
  imageName: string;
  name: string;
  description: string;
  receiver: string;
  claimed: boolean;
  chain: string;
};

export default function NFTCard(props: NFTCardProps) {
  const { image, imageName, name, description, receiver, claimed, chain } =
    props;

  return (
    <div className="max-w-xs overflow-hidden transition-all duration-200 border border-2 rounded shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-1.5 ease">
      <Image
        src={
          image && imageName
            ? `https://ipfs.io/ipfs/${image}/${imageName}`
            : "/images/nftlink.png"
        }
        alt={imageName?.split(".")[0]}
        width={500}
        height={400}
        layout="responsive"
        objectFit="cover"
      />
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">{name}</div>
        <p className="text-base text-gray-700">{description}</p>
        <p className="text-xs text-base text-gray-500 truncate">{`Receiver: ${
          receiver || "None"
        }`}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full">
          {claimed ? "✔ Claimed" : "❌ Unclaimed"}
        </span>
        <span className="inline-block px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full">
          {/* {chain} */}
          Ethereum
        </span>
      </div>
    </div>
  );
}
