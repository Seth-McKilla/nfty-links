import { ReactNode } from "react";

interface Props {
  open: boolean;
  children: ReactNode;
}

export default function Modal(props: Props) {
  const { open, children } = props;

  return open ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="relative w-auto max-w-3xl mx-auto my-6">
          <div className="relative flex flex-col bg-white border-0 rounded-lg shadow-lg">
            {children}
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  ) : null;
}
