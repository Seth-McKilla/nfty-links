import type { NextApiRequest, NextApiResponse } from "next";
import { NFTStorage, File } from "nft.storage";
import formidable from "formidable";
import jwt from "jsonwebtoken";

export const config = {
  api: {
    bodyParser: false,
  },
};

declare const process: {
  env: {
    NFT_STORAGE_API_KEY: string;
    CLIENT_URL: string;
    JWT_SECRET: string;
  };
};

const { NFT_STORAGE_API_KEY, CLIENT_URL, JWT_SECRET } = process.env;
const client = new NFTStorage({
  token: NFT_STORAGE_API_KEY,
});

type Data = {
  message: string;
  error: string | null;
};
type Recipient = {
  name: string;
  email: string;
};

// convert formidable cb to async/await
const parseForm = (req: NextApiRequest) => {
  const form = new formidable.IncomingForm();
  return new Promise(function (resolve, reject) {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve([fields, files]);
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(405).json({
      message: "Method not allowed",
      error: null,
    });
  }

  try {
    const [fields, files]: any = await parseForm(req); // Fix "any" type
    const { ipnft } = await client.store({
      name: fields.name,
      description: fields.description,
      image: new File([files[0]], files[0].name, { type: files[0].type }),
    });

    const jwtToken = jwt.sign(
      {
        ipnft,
      },
      JWT_SECRET
    );

    fields.recipients.map((recipient: Recipient) => {
      // Placeholder for firing off emails to recipients with sendgrid or similar
      console.log({ recipient, link: `${CLIENT_URL}/${jwtToken}` });
    });

    return res.status(200).json({ message: "Success", error: null });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error", error: error.message });
  }
}
