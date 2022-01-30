package cc.nftlink.backend.db.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@Data
@Builder
@RedisHash("NftOwner")
@AllArgsConstructor
@NoArgsConstructor
public class NftOwner {

    @Indexed
    private String address;
    @Indexed
    private String owner;
}
