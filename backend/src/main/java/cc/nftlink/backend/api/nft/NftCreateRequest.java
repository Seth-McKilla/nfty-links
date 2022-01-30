package cc.nftlink.backend.api.nft;

import lombok.Data;

import java.math.BigInteger;

@Data
public class NftCreateRequest {
    private String name;
    private String image;
    private String description;
    private String chain;
    private String type;
    private BigInteger maxClaims;
}
