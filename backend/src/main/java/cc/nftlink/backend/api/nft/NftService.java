package cc.nftlink.backend.api.nft;

import cc.nftlink.backend.db.model.Nft;
import cc.nftlink.backend.db.model.User;
import cc.nftlink.backend.db.repository.NftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NftService {

    private final NftRepository nftRepository;

    // create new record in database for the NFT
    public Nft createNFT(NftCreateRequest request, User user) {
        var nft = Nft.builder()
                .description(request.getDescription())
                .name(request.getName())
                .image(request.getImage())
                .claimed(false)
                .creator(user.getAddress())
                .address(null)
                .build();
        return nftRepository.save(nft);
    }

    public Nft getNFT(String id, User user) {
        var nft = nftRepository.findById(id).orElseThrow();
        if (nft.getCreator().equals(user.getAddress())) {
            return nft;
        } else {
            throw new IllegalArgumentException("You are not the owner of this NFT");
        }

    }

    public Nft mintNFT(String id, User user) {
        return null;
    }

    public List<Nft> getNFTbyCreator(String id, User user) {
        return nftRepository.findByCreator(user.getAddress());
    }
}
