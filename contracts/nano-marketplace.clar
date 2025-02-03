;; Marketplace contract for nano innovations

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-not-authorized (err u403))

;; Data maps
(define-map listings uint {
  price: uint,
  seller: principal
})

;; List item for sale
(define-public (list-item (token-id uint) (price uint))
  (let ((owner (unwrap! (contract-call? .nano-item get-owner token-id) err-not-authorized)))
    (asserts! (is-eq tx-sender owner) err-not-authorized)
    (try! (contract-call? .nano-item transfer token-id (as-contract tx-sender)))
    (map-set listings token-id {
      price: price,
      seller: tx-sender
    })
    (ok true)))

;; Purchase listed item
(define-public (purchase-item (token-id uint))
  (let ((listing (unwrap! (map-get? listings token-id) (err u404)))
        (price (get price listing))
        (seller (get seller listing)))
    (try! (stx-transfer? price tx-sender seller))
    (try! (as-contract (contract-call? .nano-item transfer token-id tx-sender)))
    (map-delete listings token-id)
    (ok true)))
