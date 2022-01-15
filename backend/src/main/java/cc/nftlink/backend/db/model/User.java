package cc.nftlink.backend.db.model;

import lombok.*;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;

@Data
@Builder
@RedisHash("User")
@RequiredArgsConstructor
@AllArgsConstructor
@NoArgsConstructor
public class User implements UserDetails {

    @Indexed
    private String id;
    @Indexed
    @NonNull
    private String address;
    @NonNull
    private String nonce;
    @Indexed
    private String username;
    private String email;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return new HashSet<GrantedAuthority>();
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public boolean isAccountNonExpired() {
        return false;
    }

    @Override
    public boolean isAccountNonLocked() {
        return false;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return false;
    }

    @Override
    public boolean isEnabled() {
        return false;
    }
}
