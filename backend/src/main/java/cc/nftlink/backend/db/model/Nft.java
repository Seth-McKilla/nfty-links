package cc.nftlink.backend.db.model;

import lombok.*;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.util.UUID;

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
}
