import { useEffect, useState } from "react";

const ipfsUrl = (location: string) => `https://ipfs.io/ipfs/${location}`;

export default function useNFTImage(imageId: string) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const fetchImage = async () => {
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
      mounted = false;
    };
  }, [imageId]);

  return { imageUrl, loading, error };
}
