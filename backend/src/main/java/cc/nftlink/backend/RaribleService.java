package cc.nftlink.backend;

import cc.nftlink.backend.api.nft.NftCreateRequest;
import cc.nftlink.backend.db.model.Nft;
import cc.nftlink.backend.db.model.User;
import org.springframework.stereotype.Service;

@Service
public class RaribleService {

    public Nft importRaribleToken(NftCreateRequest tokenHash, User user) {
        return null;
        // TODO import opensea NFT token instead of creating own
    }

    public Nft readRaribleTokenMetadata(String tokenHash, User user) {
        return null;
        // TODO import opensea NFT token instead of creating own
    }
}
