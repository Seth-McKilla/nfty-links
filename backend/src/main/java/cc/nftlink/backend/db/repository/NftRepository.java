package cc.nftlink.backend.db.repository;

import cc.nftlink.backend.db.model.Nft;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NftRepository extends CrudRepository<Nft, String> {

    List<Nft> findByCreator(String creator);
    // findby Creator or the nftOwner.owner
    List<Nft> findByCreatorOrNftOwners(String creator, String nftOwner);
}