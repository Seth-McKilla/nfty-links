import Image from "next/image";
import useNFTImage from "../../hooks/useNFTImage";
import {useRouter} from "next/router";
import {Nft} from "../../models/models";

export default function NFTCard(props: Nft) {
  const { image, name, description, chain, totalClaims, maxClaims } = props;
  const { imageUrl } = useNFTImage(image);
  const router = useRouter();

  return (
    <div className="max-w-xs overflow-hidden transition-all duration-200 border border-2 rounded shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-1.5 ease"
    onClick={async () => {
      await router.push("nfts/" + props.id)
    }}>
      <Image
        src={imageUrl ? imageUrl : "/images/nftlink.png"}
        alt={imageUrl?.split("/").slice(-1)[0]}
        placeholder="blur"
        blurDataURL="/images/nftlink.png"
        width={500}
        height={400}
        layout="responsive"
        objectFit="cover"
      />
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">{name}</div>
        <p className="text-base text-gray-700">{description}</p>
        <p className="text-xs text-base text-gray-500 truncate">{`Receiver: ${
          "receiver" || "None"
        }`}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full">
          {(maxClaims <= totalClaims) ? "✔ Claimed" : "❌ Unclaimed"}

        </span>
        <span className="inline-block px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full">
          {/* {chain} */}
          Ethereum
        </span>
      </div>
    </div>
  );
}
