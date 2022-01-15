package cc.nftlink.backend;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Bip32ECKeyPair;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.MnemonicUtils;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthGetBalance;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.DefaultGasProvider;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Paths;

import static org.web3j.crypto.Bip32ECKeyPair.HARDENED_BIT;

@Service
@Slf4j
@RequiredArgsConstructor
public class BlockchainService {

    @Value("${blockchain.url}")
    private String nodeUrl;
    @Value("${blockchain.mnemonic.path}")
    private String mnemonicPath;
    @Value("${blockchain.nft.address}")
    private String nftAddress;
    private Web3j web3;
    private Credentials credentials;

    @PostConstruct
    private void init() throws IOException {
        this.web3 = Web3j.build(new HttpService(nodeUrl));
        web3.ethBlockNumber().flowable().subscribe(blockNumber -> {
            log.info("Blockchain node is up and running. Current block number: {}", blockNumber.getBlockNumber());
        });

        String seed = new String(Files.readAllBytes(Paths.get(mnemonicPath)));
        Bip32ECKeyPair masterKeypair = Bip32ECKeyPair.generateKeyPair(MnemonicUtils.generateSeed(seed, ""));
        int[] path = {44 | HARDENED_BIT, 60 | HARDENED_BIT, HARDENED_BIT, 0, 0};
        Bip32ECKeyPair  x = Bip32ECKeyPair.deriveKeyPair(masterKeypair, path);
        this.credentials = Credentials.create(x);
        log.info("Signer public address: {}", credentials.getAddress());

    }

    public String mintNFT(String address, String hash) {
        try {

            EthGetBalance ethGetBalance = web3
                    .ethGetBalance(credentials.getAddress(), DefaultBlockParameterName.LATEST)
                    .sendAsync()
                    .get();

            BigInteger wei = ethGetBalance.getBalance();
            NftLink nft = NftLink.load(nftAddress, web3, credentials, new DefaultGasProvider());
            var result =  nft.mintNFT(address, hash).send();
            return result.getTransactionHash();


        } catch (Exception e) {
            e.printStackTrace();
            log.error("Error: {}", e.getMessage());
            throw new RuntimeException("Failed to mint NFT");
        }
    }
}
