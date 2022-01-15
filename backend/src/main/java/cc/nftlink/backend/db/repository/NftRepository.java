package cc.nftlink.backend.db.repository;

import cc.nftlink.backend.db.model.Nft;
import cc.nftlink.backend.db.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NftRepository extends CrudRepository<Nft, String> {
    Optional<Nft> findByReceiverIgnoreCase(String address);
    Optional<Nft> findBySenderIgnoreCase(String name);
    Optional<Nft> findByAddressIgnoreCase(String email);
    Optional<Nft> findByUUId(UUID id);
    List<Nft> findByCreator(String creator);
}