package cc.nftlink.backend.api.auth;

import cc.nftlink.backend.db.model.User;
import cc.nftlink.backend.db.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.web3j.crypto.ECDSASignature;
import org.web3j.crypto.Hash;
import org.web3j.crypto.Keys;
import org.web3j.crypto.Sign;
import org.web3j.utils.Numeric;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Arrays;

@Service
@AllArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    public static final String PERSONAL_MESSAGE_PREFIX = "\u0019Ethereum Signed Message:\n";

    public String generateNonce(String publicAddress) {
        var userOptional = userRepository.findByAddressIgnoreCase(publicAddress);
        var nonce = "Welcome to the nftlink.cc, " + publicAddress + " " + new Timestamp(System.currentTimeMillis());
        userOptional.ifPresentOrElse(
                value -> {
                    value.setNonce(nonce);
                    userRepository.save(value);
                },
                () -> userRepository.save(new User(publicAddress, nonce))
        );
        return nonce;
    }

    public User authenticate(String publicAddress, String signature) throws Exception {
        var user = userRepository.findByAddressIgnoreCase(publicAddress);
        if (user.isPresent()) {
            if (verifySignature(user.get().getNonce(), publicAddress, signature)) {
                user.get().setNonce("");
                return userRepository.save(user.get());
            } else {
                throw new Exception("Invalid signature");
            }
        } else {
            throw new Exception("User not found");
        }
    }

    boolean verifySignature(String message, String address, String signature) {
        String prefix = PERSONAL_MESSAGE_PREFIX + message.length();
        byte[] msgHash = Hash.sha3((prefix + message).getBytes());

        byte[] signatureBytes = Numeric.hexStringToByteArray(signature);
        byte v = signatureBytes[64];
        if (v < 27) {
            v += 27;
        }
        Sign.SignatureData sd =
                new Sign.SignatureData(
                        v,
                        (byte[]) Arrays.copyOfRange(signatureBytes, 0, 32),
                        (byte[]) Arrays.copyOfRange(signatureBytes, 32, 64));

        String addressRecovered = null;
        boolean match = false;

        // Iterate for each possible key to recover
        for (int i = 0; i < 4; i++) {
            BigInteger publicKey =
                    Sign.recoverFromSignature(
                            (byte) i,
                            new ECDSASignature(
                                    new BigInteger(1, sd.getR()), new BigInteger(1, sd.getS())),
                            msgHash);

            if (publicKey != null) {
                addressRecovered = "0x" + Keys.getAddress(publicKey);

                if (addressRecovered.equalsIgnoreCase(address)) {
                    match = true;
                    break;
                }
            }
        }

        return match;
    }
}
