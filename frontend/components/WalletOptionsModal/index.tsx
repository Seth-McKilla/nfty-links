import Image from "next/image";
import { useEffect, useContext } from "react";
import { Context } from "../../context";
import { LOGIN } from "../../context/constants";
import { useConnect, useAccount, useSignMessage, Connector } from "wagmi";
import { Button } from "..";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { Modal } from "..";
const { NEXT_PUBLIC_API_URL } = process.env;

interface Props {
  open: boolean;
  setOpen: (showWalletOptions: boolean) => void;
}

export default function WalletOptionsModal(props: Props) {
  const { open, setOpen } = props;

  const { state, dispatch } = useContext(Context);

  const [{ data: connectData, loading, error }, connect] = useConnect();
  const [{ data: accountData }] = useAccount();
  const [_, signMessage] = useSignMessage();

  const login = async (c: Connector) => {
    try {
      dispatch({ type: LOGIN["REQUEST"], payload: {} });
      // Connect to blockchain
      await connect(c);
      const address = accountData?.address;

      // Login and receive message to sign
      const loginResponse = await fetch(
        `${NEXT_PUBLIC_API_URL}auth/login?publicAddress=${address}`
      );
      const message = await loginResponse.text();

      // Sign message and receive auth token
      const { data: sig } = await signMessage({ message });

      const response = await fetch(`${NEXT_PUBLIC_API_URL}auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          sig,
        }),
      });
      const token = await response.text();
      dispatch({ type: LOGIN["SUCCESS"], payload: { token } });
      setOpen(false);
    } catch (error: any) {
      console.error(error);
      dispatch({ type: LOGIN["FAIL"], payload: { error } });
    }
  };

  useEffect(() => {
    accountData && setOpen(false);
  }, [accountData, setOpen]);

  return (
    <Modal open={open}>
      <div className="flex items-center justify-around p-5 mb-4">
        <MdOutlineAccountBalanceWallet className="flex m-1 text-4xl" />
        <h3 className="text-3xl font-semibold text-left">Choose a Wallet</h3>
      </div>

      {connectData.connectors.map((c) => (
        <div key={c.id} className="mb-2 ml-2 mr-2 w-80">
          <Button
            loading={loading}
            width={80}
            disabled={!c.ready}
            onClick={() => login(c)}
          >
            <>
              <div className="mr-3">
                <Image
                  src={`/images/${c.id}.svg`}
                  alt={c.name}
                  height={32}
                  width={32}
                />
              </div>
              {`${c.name}${!c.ready ? " (unsupported)" : ""}`}
            </>
          </Button>
        </div>
      ))}
      {error && (
        <div className="ml-2 text-red-500">
          {error?.message ?? "Failed to connect"}
        </div>
      )}

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
