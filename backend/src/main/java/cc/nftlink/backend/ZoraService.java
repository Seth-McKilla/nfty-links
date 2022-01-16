package cc.nftlink.backend;

import cc.nftlink.backend.api.nft.NftCreateRequest;
import cc.nftlink.backend.db.model.Nft;
import cc.nftlink.backend.db.model.User;
import org.springframework.stereotype.Service;

@Service
public class ZoraService {
    public Nft importZoraToken(NftCreateRequest tokenHash, User user) {
        // TODO import opensea NFT token instead of creating own
        return null;
    }

    public Nft readZoraFTMetadata(String tokenHash, User user) {
        // TODO import opensea NFT token instead of creating own
        return null;
    }
}
