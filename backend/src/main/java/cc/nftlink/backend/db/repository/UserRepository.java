package cc.nftlink.backend.db.repository;

import cc.nftlink.backend.db.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, String> {
    Optional<User> findByAddress(String address);
    Optional<User> findByUsername(String name);
    Optional<User> findByAddressIgnoreCase(String email);
}