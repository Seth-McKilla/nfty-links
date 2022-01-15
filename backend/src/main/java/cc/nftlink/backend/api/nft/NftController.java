package cc.nftlink.backend.api.nft;

import cc.nftlink.backend.db.model.Nft;
import cc.nftlink.backend.db.model.User;
import lombok.AllArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class NftController {

    private final NftService nftService;

    @PostMapping("nft/create")
    public Nft createNFTLink(
            @RequestBody NftCreateRequest request,
            @ApiIgnore  @AuthenticationPrincipal User user
    ) {
        return nftService.createNFT(request, user);
    }

    @GetMapping("nft/{uuid}")
    public Nft getNFTData(
            @PathVariable("uuid") String id,
            @ApiIgnore @AuthenticationPrincipal User user
    ) {
        return nftService.getNFT(id, user);
    }

    @PostMapping("nft/{uuid}")
    public Nft mintNFT(
            @PathVariable("uuid") String id,
            @ApiIgnore @AuthenticationPrincipal User user
    ) {
        return nftService.mintNFT(id, user);
    }

    @GetMapping("nfts")
    public List<Nft> getNFTs(
            @PathVariable("id") String id,
            @ApiIgnore @AuthenticationPrincipal User user
    ) {
        return nftService.getNFTbyCreator(id, user);
    }
}
