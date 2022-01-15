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
import org.web3j.utils.Convert;

import javax.annotation.PostConstruct;
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
    private Web3j web3;

    @PostConstruct
    private void init() {
        this.web3 = Web3j.build(new HttpService(nodeUrl));
        web3.ethBlockNumber().flowable().subscribe(blockNumber -> {
            log.info("Blockchain node is up and running. Current block number: {}", blockNumber.getBlockNumber());
        });
    }

    public String mintNFT(String address, String hash) {
        try {
            String seed = new String(Files.readAllBytes(Paths.get(mnemonicPath)));
            Bip32ECKeyPair masterKeypair = Bip32ECKeyPair.generateKeyPair(MnemonicUtils.generateSeed(seed, ""));
            int[] path = {44 | HARDENED_BIT, 60 | HARDENED_BIT, HARDENED_BIT, 0, 0};
            Bip32ECKeyPair  x = Bip32ECKeyPair.deriveKeyPair(masterKeypair, path);
            var credentials = Credentials.create(x);
            log.info("Credentials public: {}", credentials.getEcKeyPair().getPublicKey());
            log.info("Credentials address: {}", credentials.getAddress());

            EthGetBalance ethGetBalance = web3
                    .ethGetBalance(credentials.getAddress(), DefaultBlockParameterName.LATEST)
                    .sendAsync()
                    .get();

            BigInteger wei = ethGetBalance.getBalance();
            log.info("Balance: {}", Convert.fromWei(wei.toString(), Convert.Unit.ETHER));
            NftLink nft = NftLink.load("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", web3, credentials, new DefaultGasProvider());
            return nft.mintNFT(address, hash).send().getTransactionHash();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to mint NFT");
        }
    }
}
