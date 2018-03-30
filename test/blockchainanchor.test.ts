import assert from 'assert';
import BlockchainAnchor from '../src/blockchainanchor';

describe('anchor and validate on ETH', () => {
  const blockchainAnchor = new BlockchainAnchor();

  let transactionId;

  it('can anchor a hash on the ETH blockchain', async () => {
    transactionId = await blockchainAnchor.anchor(
      '0x52b8398551bb1d0bdc022355897508f658ad42f8',
      '0xa292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb',
      {
        network: 'rinkeby',
        privateKey:
          '0x99c2a24def7e4f3f9c634d1179ca7e86527c70f176022675669bba9bb0d6ad61',
        type: 'ETH'
      }
    );
  });

  it('fails when there is no mined transaction yet on the ETH blockchain', async () => {
    const validationResult = await blockchainAnchor.verify(
      transactionId,
      '0xa292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb',
      {
        network: 'rinkeby',
        type: 'ETH'
      }
    );
    assert(!validationResult);
  });

  it('can verify a hash on the ETH blockchain', async () => {
    const validationResult = await blockchainAnchor.verify(
      '0x08f7e2706bb35522bd3ab59f4b46e5d01e1db05a551ca68c4624637aab2d4b3f',
      '0xa292780cc748697cb499fdcc8cb89d835609f11e502281dfe3f6690b1cc23dcb',
      {
        network: 'rinkeby',
        type: 'ETH'
      }
    );
    assert(validationResult);
  });
});
