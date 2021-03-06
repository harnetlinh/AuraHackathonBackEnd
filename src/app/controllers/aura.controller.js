import {
    SigningCosmWasmClient,
    CosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import dotenv from "dotenv";
dotenv.config();

const mnemonic = process.env.MNEMONIC;
const rpcEndpoint = process.env.RPC;
const contractAddress = process.env.CONTRACT;

const getWallet = async () => {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
        prefix: "aura",
    });
    return wallet;
};

const get1stAccount = async (wallet) => {
    const [firstAccount] = await wallet.getAccounts();
    return firstAccount;
};

const getSigningAuraWasmClient = async (wallet) => {
    const signingClient = await SigningCosmWasmClient.connectWithSigner(
        rpcEndpoint,
        wallet
    );
    return signingClient;
};

const getAuraWasmClient = async () => {
    const client = await CosmWasmClient.connect(rpcEndpoint);
    return client;
  }

const MintNFT = async (req, res) => {

    const { token_id, owner, token_uri, extension } = req.body;

    let wallet = await getWallet();

    let firstAccount = await get1stAccount(wallet);

    let signingClient = await getSigningAuraWasmClient(wallet);

    const mintMsg = {
        mint: {
            token_id,
            owner,
            token_uri,
            extension,
        },
    };

    const fee = {
        amount: [
            {
                denom: "uaura",
                amount: "160",
            },
        ],
        gas: "152375",
    };

    try {
        const result = await signingClient.execute(
            firstAccount.address,
            contractAddress,
            mintMsg,
            fee
        );
        res.status(200).json({
            data: [result],
            message: "Mint Result",
            status: "success",
        });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
};

const getAllToken = async (req, res) => {
    /* 	#swagger.tags = ['All Token']
    #swagger.description = 'Get all NFT Token' */
  
    if (!client) {
      var client = await getAuraWasmClient();
    }

    const allTokenOwner = {
      tokens: {
        owner: String(req.query.address),
      },
    };
    try {
      const result = await client.queryContractSmart(
        contractAddress,
        allTokenOwner
      );
      res.status(200).json({
        data: [result],
        message: "Found Result",
        status: "success",
      });
    } catch (error) {
      res.status(400).json({ status: "error", error: error.message });
    }
  };

export { MintNFT, getAllToken };
