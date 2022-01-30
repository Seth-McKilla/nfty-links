export interface Nft {
  id : string
  name : string
  description : string
  image : string
  maxClaims :number
  totalClaims : number
  creator : string
  nftOwners : NftOwner[]
  chain : 'rinkeby' | 'mainnet'
  type: 'ZORA' | 'OPEN_SEA' | 'RARIBLE' | 'STANDARD'
}

export interface NftOwner {
  address : string
  owner : string
}