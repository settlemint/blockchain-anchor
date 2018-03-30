import { providers, utils, Wallet } from 'ethers';

export type ChainType = 'ETH' | 'BTC';

export interface IChain {
  type: ChainType;
  network: string;
  privateKey?: string;
  token?: string;
}

export default class BlockchainAnchor {
  public async anchor(
    toAddress: string,
    hexData: string,
    chain: IChain
  ): Promise<string> {
    const provider = new providers.InfuraProvider(chain.network);
    const wallet = new Wallet(chain.privateKey, provider);
    const balance = await wallet.getBalance('latest');
    const gasPrice = utils.bigNumberify('10000000000'); // 10 Gwei

    const transaction = {
      data: hexData,
      gasPrice,
      to: toAddress
    };

    const gasEstimate = await wallet.estimateGas(transaction);
    const txCost = gasEstimate.mul(gasPrice);

    if (balance.lt(txCost)) {
      throw new Error('Insufficient ETH in the sender account to anchor');
    }

    const { hash } = await wallet.sendTransaction(transaction);

    return hash;
  }

  public async verify(
    transactionId: string,
    expectedValue: string,
    chain: IChain
  ): Promise<boolean> {
    const provider = new providers.InfuraProvider(chain.network);
    const transactionReceipt = await provider.getTransactionReceipt(
      transactionId
    );
    return transactionReceipt ? true : false;
  }
}
