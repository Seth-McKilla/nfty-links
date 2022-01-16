package cc.nftlink.backend.db.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@Data
@Builder
@RedisHash("Nft")
@AllArgsConstructor
@NoArgsConstructor
public class Nft {

    @Indexed
    private String id;
    private String address;
    private String name;
    private String description;
    private String image;
    private boolean claimed;
    @Indexed
    private String creator;
    @Indexed
    private String receiver;
    @Indexed
    private String chain;
    @Indexed NftTypeEnum type;
}
