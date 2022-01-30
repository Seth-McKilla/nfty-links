package cc.nftlink.backend.api.nft;

import cc.nftlink.backend.*;
import cc.nftlink.backend.db.model.Nft;
import cc.nftlink.backend.db.model.NftOwner;
import cc.nftlink.backend.db.model.User;
import cc.nftlink.backend.db.repository.NftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NftService {

    private final NftRepository nftRepository;
    private final BlockchainService blockchainService;
    private final IpfsService ipfsService;
    private final OpenSeaService openSeaService;
    private final RaribleService raribleService;
    private final ZoraService zoraService;

    // create new record in database for the NFT
    public Nft createNFT(NftCreateRequest request, User user) {
        if (request.getType() == null) {
            var nft = Nft.builder()
                    .description(request.getDescription())
                    .name(request.getName())
                    .image(request.getImage())
                    .chain(request.getChain())
                    .maxClaims(request.getMaxClaims())
                    .totalClaims(BigInteger.ZERO)
                    .creator(user.getAddress())
                    .build();
            return nftRepository.save(nft);
        }
        if (request.getType().equals("rarible")) {
            return raribleService.importRaribleToken(request, user);
        }
        if (request.getType().equals("zora")) {
            return zoraService.importZoraToken(request, user);
        }
        if (request.getType().equals("openSea")) {
            return openSeaService.importOpenSeaToken(request, user);
        } else {
            throw new IllegalArgumentException("Invalid token type");
        }
    }

    public Nft getNFT(String id) {
        return nftRepository.findById(id).orElseThrow();

    }

    public Nft mintNFT(String id, User user) {
        var nft = nftRepository.findById(id).orElseThrow();
        if (nft.getMaxClaims().compareTo(nft.getTotalClaims()) <= 0) {
            throw new IllegalArgumentException("This NFT has already been claimed the maximum number of times");
        }
        String hash = ipfsService.createIpfsRecord(nft);
        String nftHash =  blockchainService.mintNFT(user.getAddress(), hash);
        nft.setTotalClaims(nft.getTotalClaims().add(BigInteger.ONE));
        NftOwner owner = new NftOwner(nftHash, user.getAddress());
        nft.getNftOwners().add(owner);
        return nftRepository.save(nft);
    }

    public List<Nft> getNftsByCreator(User user) {
        return nftRepository.findByCreator(user.getAddress());
    }

    public List<Nft> getNftsByCreatorOrReceiver(User user) {
        return nftRepository.findByCreatorOrNftOwners(user.getAddress(), user.getAddress());
    }
}
