package cc.nftlink.backend.db.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.math.BigInteger;
import java.util.ArrayList;

@Data
@Builder
@RedisHash("Nft")
@AllArgsConstructor
@NoArgsConstructor
public class Nft {

    @Indexed
    private String id;
    private String name;
    private String description;
    private String image;
    private BigInteger maxClaims;
    private BigInteger totalClaims;
    @Indexed
    private String creator;
    @Indexed
    private ArrayList<NftOwner> nftOwners;
    @Indexed
    private String chain; // rinkeby, ethereum, polygon, harmony,
    @Indexed NftTypeEnum type;
}
