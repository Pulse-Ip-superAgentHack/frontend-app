import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT
});

export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
  const { IpfsHash } = await pinata.upload.json(jsonMetadata);
  return IpfsHash;
}

// Placeholder for IPFS upload utilities
export const uploadToIPFS = async (file: File) => {
  console.log('IPFS upload not implemented');
  return { error: 'IPFS upload not available' };
};