import Image from "next/image";

interface Props {
  image: string;
  imageName: string;
  name: string;
  description: string;
  receiver: string;
  claimed: boolean;
  chain: string;
}

export default function NFTCard(props: Props) {
  const { image, imageName, name, description, receiver, claimed, chain } =
    props;

  return (
    <div className="max-w-sm overflow-hidden rounded shadow-lg">
      <Image
        className="w-full"
        src={`https://ipfs.io/ipfs/${image}/${imageName}`}
        alt="Sunset in the mountains"
      />
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">{name}</div>
        <p className="text-base text-gray-700">{description}</p>
        <p className="text-base text-gray-700">{receiver}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full">
          {claimed ? "✔ Claimed" : "❌ Unclaimed"}
        </span>
        <span className="inline-block px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full">
          {chain}
        </span>
      </div>
    </div>
  );
}
