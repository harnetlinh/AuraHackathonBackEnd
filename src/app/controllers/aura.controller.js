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

const MintNFT = async (req, res) => {
    let wallet = await getWallet();

    let firstAccount = await get1stAccount(wallet);

    let signingClient = await getSigningAuraWasmClient(wallet);

    const mintMsg = {
        mint: {
            token_id: req.body.token_id,
            owner: req.body.owner,
            token_uri: req.body.token_uri,
            extension: req.body.extension,
        },
    };

    const fee = {
        amount: [
            {
                denom: "uaura",
                amount: "1",
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
        });
    } catch (err) {
        res.status(500).json({
            data: [err.message],
            message: "Error",
        });
    }
};

export { MintNFT };
