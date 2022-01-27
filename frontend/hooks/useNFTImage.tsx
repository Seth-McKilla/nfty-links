import { useEffect, useState, useRef } from "react";

const ipfsUrl = (location: string) => `https://ipfs.io/ipfs/${location}`;

export default function useNFTImage(imageId: string) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    const fetchImage = async () => {
      if (!imageId || !isMounted.current) return;
      setLoading(true);
      setError("");

      try {
        const response = await fetch(ipfsUrl(`${imageId}/metadata.json`));
        const { image } = await response.json();
        const location = image
          .split("/")
          .slice(-2)
          .join("/")
          .replace(/ /g, "%20");

        setImageUrl(ipfsUrl(location));
      } catch (error: any) {
        console.error(error);
        setError(error.message);
      }

      return setLoading(false);
    };

    fetchImage();

    return () => {
      isMounted.current = false;
    };
  }, [imageId]);

  return { imageUrl, loading, error };
}
