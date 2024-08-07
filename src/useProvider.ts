import { JsonRpcApiProvider, JsonRpcProvider, WebSocketProvider } from "ethers";
import { ProbeError } from "./ProbeError";
import { MIN_API_LEVEL } from "./params";
import { ConnectionStatus } from "./types";

export const DEFAULT_ERIGON_URL = "http://127.0.0.1:8545";

export const createAndProbeProvider = async (
  erigonURL?: string,
): Promise<JsonRpcApiProvider> => {
  if (erigonURL !== undefined) {
    if (erigonURL === "") {
      console.info(`Using default erigon URL: ${DEFAULT_ERIGON_URL}`);
      erigonURL = DEFAULT_ERIGON_URL;
    } else {
      console.log(`Using configured erigon URL: ${erigonURL}`);
    }
  }

  if (erigonURL === undefined) {
    throw new ProbeError(ConnectionStatus.NOT_ETH_NODE, "");
  }

  let provider: JsonRpcApiProvider;
    // @smatthewenglish note - not using websockets
    // Batching takes place by default
    provider = new JsonRpcProvider(erigonURL, undefined, {
      staticNetwork: true,
    });

  // Check if it is at least a regular ETH node
  const probeBlockNumber = provider.getBlockNumber();

  const probeBlock1 = await provider.send("eth_getBlockByNumber", ['0x0', false]);
  const probeHeader1 = extractBlockHeader(probeBlock1);

  const probeOtsAPI = MIN_API_LEVEL;

  try {
    await Promise.all([probeBlockNumber, probeHeader1, probeOtsAPI]);
    return provider;
  } catch (err) {
    // If any was rejected, then check them sequencially in order to
    // narrow the error cause, but we need to await them individually
    // because we don't know if all of them have been finished

    try {
      await probeBlockNumber;
    } catch (err) {
      console.log(err);
      throw new ProbeError(ConnectionStatus.NOT_ETH_NODE, erigonURL);
    }

    // Check if it is an Erigon node by probing a lightweight method
    try {
      // Get header for block 1
      await probeHeader1;
    } catch (err) {
      console.log(err);
      throw new ProbeError(ConnectionStatus.NOT_ERIGON, erigonURL);
    }

    // Check if it has Otterscan patches by probing a lightweight method
    try {
      await probeOtsAPI;
    } catch (err) {
      console.log(err);
      throw new ProbeError(ConnectionStatus.NOT_OTTERSCAN_PATCHED, erigonURL);
    }

    throw new Error("Must not happen", { cause: err });
  }
};

function extractBlockHeader(block: any) {
  console.log('Sull block object:');
  console.log(block);

  let baseFeePerGas = "0x3b9aca00";
  console.log('baseFeePerGas:', baseFeePerGas);
  let blobGasUsed = "0x0";
  console.log('blobGasUsed:', blobGasUsed);
  let difficulty = block.difficulty;
  console.log('difficulty:', difficulty);
  let excessBlobGas = "0x0";
  console.log('excessBlobGas:', excessBlobGas);
  let extraData = block.extraData;
  console.log('extraData:', extraData);
  let gasLimit = block.gasLimit;
  console.log('gasLimit:', gasLimit);
  let gasUsed = block.gasUsed;
  console.log('gasUsed:', gasUsed);
  let hash = block.hash;
  console.log('hash:', hash);
  let logsBloom = block.logsBloom;
  console.log('logsBloom:', logsBloom);
  let miner = block.miner;
  console.log('miner:', miner);
  let mixHash = block.mixHash;
  console.log('mixHash:', mixHash);
  let nonce = block.nonce;
  console.log('nonce:', nonce);
  let number = block.number;
  console.log('number:', number);
  let parentHash = block.parentHash;
  console.log('parentHash:', parentHash);
  let receiptsRoot = block.receiptsRoot;
  console.log('receiptsRoot:', receiptsRoot);
  let sha3Uncles = block.sha3Uncles;
  console.log('sha3Uncles:', sha3Uncles);
  let size = block.size;
  console.log('size:', size);
  let stateRoot = block.stateRoot;
  console.log('stateRoot:', stateRoot);
  let timestamp = block.timestamp;
  console.log('timestamp:', timestamp);
  let totalDifficulty = "0x0";
  console.log('totalDifficulty:', totalDifficulty);
  let transactions: any[] = [];
  console.log('transactions:', transactions);
  let transactionsRoot = block.transactionsRoot;
  console.log('transactionsRoot:', transactionsRoot);
  let uncles: any[] = [];
  console.log('uncles:', uncles);
  
  return {
    baseFeePerGas,
    blobGasUsed,
    difficulty,
    excessBlobGas,
    extraData,
    gasLimit,
    gasUsed,
    hash,
    logsBloom,
    miner,
    mixHash,
    nonce,
    number,
    parentHash,
    receiptsRoot,
    sha3Uncles,
    size,
    stateRoot,
    timestamp,
    totalDifficulty,
    transactions,
    transactionsRoot,
    uncles
  }
}