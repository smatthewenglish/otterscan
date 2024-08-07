import { Block, JsonRpcApiProvider } from "ethers";
import { useEffect, useState } from "react";
import { formatter } from "./utils/formatter";

/**
 * Returns the latest block header AND hook an internal listener
 * that'll update and trigger a component render as a side effect
 * every time it is notified of a new block by the web3 provider.
 */
export const useLatestBlockHeader = (provider?: JsonRpcApiProvider) => {
  const [latestBlock, setLatestBlock] = useState<Block>();

  useEffect(() => {
    if (!provider) {
      return;
    }

    const getAndSetBlockHeader = async (blockNumber: number) => {
      // const _raw = await provider.send("erigon_getHeaderByNumber", [
      //   blockNumber,
      // ]);
      const probeBlock1 = await provider.send("eth_getBlockByNumber", [ "0x" + blockNumber.toString(16), true]);
      const _raw = extractBlockHeader(probeBlock1);
      const _block = new Block(formatter.blockParams(_raw), provider);
      setLatestBlock(_block);
    };

    // Immediately read and set the latest block header
    const readLatestBlock = async () => {
      const blockNum = await provider.getBlockNumber();
      await getAndSetBlockHeader(blockNum);
    };
    readLatestBlock();

    // Hook a listener that'll update the latest block header
    // every time it is notified of a new block
    provider.on("block", getAndSetBlockHeader);
    return () => {
      provider.removeListener("block", getAndSetBlockHeader);
    };
  }, [provider]);

  return latestBlock;
};

/**
 * Returns the latest block number AND hook an internal listener
 * that'll update and trigger a component render as a side effect
 * every time it is notified of a new block by the web3 provider.
 *
 * This hook is cheaper than useLatestBlockHeader.
 */
export const useLatestBlockNumber = (provider?: JsonRpcApiProvider) => {
  const [latestBlock, setLatestBlock] = useState<number>();

  useEffect(() => {
    if (!provider) {
      return;
    }

    // Immediately read and set the latest block number
    const readLatestBlock = async () => {
      const blockNum = await provider.getBlockNumber();
      setLatestBlock(blockNum);
    };
    readLatestBlock();

    // Hook a listener that'll update the latest block number
    // every time it is notified of a new block
    const listener = async (blockNumber: number) => {
      setLatestBlock(blockNumber);
    };

    provider.on("block", listener);
    return () => {
      provider.removeListener("block", listener);
    };
  }, [provider]);

  return latestBlock;
};

function extractBlockHeader(block: any) {
  console.log('Xull block object:');
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