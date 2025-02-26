import { http } from "viem";
import { Account, privateKeyToAccount } from "viem/accounts";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";

// Ensure private key is properly formatted with 0x prefix
const rawPrivateKey = process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY;
if (!rawPrivateKey) {
  throw new Error('NEXT_PUBLIC_WALLET_PRIVATE_KEY environment variable is not set');
}

const privateKey = rawPrivateKey.startsWith('0x') ? rawPrivateKey : `0x${rawPrivateKey}`;
const account: Account = privateKeyToAccount(privateKey as `0x${string}`);

const config: StoryConfig = {
  account: account, // the account object from above
  transport: http(process.env.NEXT_PUBLIC_RPC_PROVIDER_URL),
  chainId: "aeneid",
};
export const client = StoryClient.newClient(config);

// Placeholder for Story Protocol utilities
export const placeholder = true;