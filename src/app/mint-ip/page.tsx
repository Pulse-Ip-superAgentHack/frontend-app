'use client'

// import { useState } from 'react'
import { IpMetadata, LicenseTerms } from '@story-protocol/core-sdk'
import { client } from '../../utils/storyUtils'
import { uploadJSONToIPFS } from '../../utils/uploadToIpfs'
import { createHash } from 'crypto'
import { Address, zeroAddress, zeroHash } from 'viem'
import React, { useEffect, useState } from "react";

export default function MintIp() {
  const [msg1, setMsg1] = useState(""); // Track msg1
  const [msg2, setMsg2] = useState(""); // Track msg2
  const [txlink, setTxlink] = useState(""); // Track txlink

  const mintIp = async () => {
    const commercialRemixTerms: LicenseTerms = {
      transferable: true,
      royaltyPolicy: '0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E', // RoyaltyPolicyLAP address from https://docs.story.foundation/docs/deployed-smart-contracts
      defaultMintingFee: BigInt(0),
      expiration: BigInt(0),
      commercialUse: true,
      commercialAttribution: true,
      commercializerChecker: zeroAddress,
      commercializerCheckerData: zeroAddress,
      commercialRevShare: 100, // can claim 100% of derivative revenue
      commercialRevCeiling: BigInt(0),
      derivativesAllowed: true,
      derivativesAttribution: true,
      derivativesApproval: false,
      derivativesReciprocal: true,
      derivativeRevCeiling: BigInt(0),
      currency: '0x1514000000000000000000000000000000000000', // $WIP address from https://docs.story.foundation/docs/deployed-smart-contracts
      uri: '',
    }
  
    const licensingConfig = {
      isSet: false,
      mintingFee: BigInt(0),
      licensingHook: zeroAddress,
      hookData: zeroHash,
      commercialRevShare: 0,
      disabled: false,
      expectMinimumGroupRewardShare: 0,
      expectGroupRewardPool: zeroAddress,
    };
  
    const ipMetadata = {
      "title": "Story AI Agent",
      "description": "This is an example test eliza AI Agent registered on Story.",
      "createdAt": "1740005219",
      "creators": [
        {
          "name": "JJ T",
          "address": `${process.env.NEXT_PUBLIC_WALLET_ADDRESS}`,
          "contributionPercent": 100
        }
      ],
      "image": "https://ipfs.io/ipfs/bafybeigi3k77t5h5aefwpzvx3uiomuavdvqwn5rb5uhd7i7xcq466wvute",
      "imageHash": "0x64ccc40de203f218d16bb90878ecca4338e566ab329bf7be906493ce77b1551a",
      "mediaUrl": "https://ipfs.io/ipfs/bafybeigi3k77t5h5aefwpzvx3uiomuavdvqwn5rb5uhd7i7xcq466wvute",
      "mediaHash": "0x64ccc40de203f218d16bb90878ecca4338e566ab329bf7be906493ce77b1551a",
      "mediaType": "image/webp",
      "aiMetadata": {
        "characterFileUrl": `${process.env.NEXT_PUBLIC_ELIZA_CHARACTER_FILE}`,
        "characterFileHash": `${process.env.NEXT_PUBLIC_ELIZA_CHARACTER_HASH}`
      },
      "ipType": "AI Agent", // experimental field
      "tags": ["AI Agent", "Twitter bot", "Smart Agent"] // experimental field
    }
  
    const nftMetadata = {
      name: 'Ownership NFT',
      description: 'This is an NFT representing owernship of our IP Asset.',
      image: 'https://picsum.photos/200',
    }
  
    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)
    const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex')
    const nftIpfsHash = await uploadJSONToIPFS(nftMetadata)
    const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex')
  
    const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
      spgNftContract: '0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc',
      // spgNftContract: '0xfE265a91dBe911db06999019228a678b86C04959',
      licenseTermsData: [{ terms: commercialRemixTerms, licensingConfig }], // IP already has non-commercial social remixing terms. You can add more here.
      allowDuplicates: true,
      ipMetadata: {
        ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
        ipMetadataHash: `0x${ipHash}`,
        nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
        nftMetadataHash: `0x${nftHash}`,
      },
      txOptions: { waitForTransaction: true },
    })
    let newMsg1 = `Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}, Token ID: ${response.tokenId}, License Terms ID: ${response.licenseTermsIds}`
    let newMsg2 = `View on the explorer: https://aeneid.explorer.story.foundation/ipa/${response.ipId}`
    setTxlink(`https://aeneid.explorer.story.foundation/ipa/${response.ipId}`)
    setMsg1(newMsg1)
    setMsg2(newMsg2)
    
    console.log(newMsg1)
    console.log(newMsg2)
  }

  return (
    <main>
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Test mint</h1>
        
        <button
        onClick={mintIp}
        className="bg-blue-500 text-white px-4 py-2 mt-4"
        >Mint Ip</button>
        <div>
        {msg2 ? <p>
          {msg1}
          <a href={txlink}>View on the explorer: {txlink}</a>
          </p> : <p>No ip</p>}
        </div>
      </div>
    </main>
  )
}