package cc.nftlink.backend.api.nft;

import cc.nftlink.backend.BlockchainService;
import cc.nftlink.backend.IpfsService;
import cc.nftlink.backend.db.model.Nft;
import cc.nftlink.backend.db.model.User;
import cc.nftlink.backend.db.repository.NftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NftService {

    private final NftRepository nftRepository;
    private final BlockchainService blockchainService;
    private final IpfsService ipfsService;

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
        var nft = nftRepository.findById(id).orElseThrow();
        if (nft.isClaimed()) {
            throw new IllegalArgumentException("This NFT has already been claimed");
        }
        String hash = ipfsService.createIpfsRecord(nft);
        String nftHash =  blockchainService.mintNFT(user.getAddress(), hash);
        nft.setClaimed(true);
        nft.setAddress(nftHash);
        nft.setReceiver(user.getAddress());
        return nftRepository.save(nft);
    }

    public List<Nft> getNftsByCreator(User user) {
        return nftRepository.findByCreator(user.getAddress());
    }
}
