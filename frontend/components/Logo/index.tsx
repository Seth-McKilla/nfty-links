import Image from "next/image";

export default function Logo({ height }: { height: number }) {
  return (
    <Image
      src="/images/nftlink.png"
      alt="NFT Link logo"
      height={height}
      width={height * 2}
    />
  );
}
