import Image from "next/image";
import { Modal } from "..";

interface Props {
  open: boolean;
  setOpen: (showWalletOptions: boolean) => void;
}

const marketplaces: string[] = ["opensea", "rarible", "zora"];

export default function ImportOptionsModal(props: Props) {
  const { open, setOpen } = props;

  return (
    <Modal open={open}>
      <div className="flex items-center justify-around p-5 mb-4">
        <h3 className="text-3xl font-semibold text-left">
          Choose a Marketplace
        </h3>
      </div>
      <div className="flex-col p-4">
        {marketplaces.map((m) => (
          <div key={m} className="h-16 m-4 border rounded-md cursor-pointer">
            <Image
              src={`/images/${m}.png`}
              alt={`${m}-logo`}
              height={16}
              width="100%"
              layout="responsive"
              objectFit="contain"
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end p-3 mt-1">
        <button
          className="px-6 py-2 mb-1 text-sm font-semibold text-red-500 uppercase"
          type="button"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
