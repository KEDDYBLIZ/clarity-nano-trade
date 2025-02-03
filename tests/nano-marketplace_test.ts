import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Can list and purchase nano item",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const seller = accounts.get("wallet_1")!;
    const buyer = accounts.get("wallet_2")!;
    
    // First mint an item
    let block = chain.mineBlock([
      Tx.contractCall("nano-item", "mint", [
        types.utf8("Quantum Dots"),
        types.utf8("Revolutionary quantum dot technology"),
        types.uint(50)
      ], seller.address),
      
      // List the item
      Tx.contractCall("nano-marketplace", "list-item", [
        types.uint(1),
        types.uint(1000)
      ], seller.address)
    ]);
    
    assertEquals(block.receipts.length, 2);
    assertEquals(block.receipts[1].result.expectOk(), true);
    
    // Purchase the item
    block = chain.mineBlock([
      Tx.contractCall("nano-marketplace", "purchase-item", [
        types.uint(1)
      ], buyer.address)
    ]);
    
    assertEquals(block.receipts[0].result.expectOk(), true);
  },
});
