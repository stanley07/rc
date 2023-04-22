const { TokenCreateTransaction, Hbar, TokenType } = require('@hashgraph/sdk');

const createToken = async (
  client,
  treasuryAccId,
  supplyKey,
  treasuryAccPvKey
) => {
  // 1. building a transaction with token type fungible
  const createTokenTxn = new TokenCreateTransaction()
    .setTokenName('Hedera Fungible Token')
    .setTokenSymbol('HFT')
    .setTokenType(TokenType.FungibleCommon)
    .setTreasuryAccountId(treasuryAccId)
    .setInitialSupply(0)
    .setSupplyKey(supplyKey)
    .setMaxTransactionFee(new Hbar(30))
    .freezeWith(client);

  // 2. Sign txn
  const createTokenTxnSigned = await createTokenTxn.sign(treasuryAccPvKey);

  // 3. submit txn to hedera network
  const txnResponse = await createTokenTxnSigned.execute(client);

  // 4. request receipt of txn
  const txnRx = await txnResponse.getReceipt(client);
  const txnStatus = txnRx.status.toString();
  const tokenId = txnRx.tokenId;

  console.log(
    `Token Type Creation was a ${txnStatus} and was created with token id: ${tokenId}`
  );

  return tokenId;
};

module.exports = { createToken };
