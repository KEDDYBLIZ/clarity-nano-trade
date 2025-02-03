;; NFT contract for nano innovations
(define-non-fungible-token nano-item uint)

;; Data vars
(define-data-var last-token-id uint u0)

;; Data maps
(define-map item-details uint {
  name: (string-utf8 256),
  description: (string-utf8 1024),
  inventor: principal,
  royalty-rate: uint
})

;; Mint new nano item
(define-public (mint (name (string-utf8 256)) 
                   (description (string-utf8 1024))
                   (royalty-rate uint))
  (let ((token-id (+ (var-get last-token-id) u1)))
    (try! (nft-mint? nano-item token-id tx-sender))
    (map-set item-details token-id {
      name: name,
      description: description,
      inventor: tx-sender,
      royalty-rate: royalty-rate
    })
    (var-set last-token-id token-id)
    (ok token-id)))

;; Transfer nano item
(define-public (transfer (token-id uint) (recipient principal))
  (nft-transfer? nano-item token-id tx-sender recipient))
