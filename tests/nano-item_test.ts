import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Can mint new nano item",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall("nano-item", "mint", [
        types.utf8("Quantum Dots"),
        types.utf8("Revolutionary quantum dot technology"),
        types.uint(50)  // 5% royalty
      ], wallet_1.address)
    ]);
    
    assertEquals(block.receipts[0].result.expectOk(), "u1");
  },
});
