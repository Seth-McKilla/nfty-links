package cc.nftlink.backend.api.auth;

import cc.nftlink.backend.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@Slf4j
public class AuthController {

    private final UserRepository userRepository;
    private final AuthService authService;
    private final JwtTokenUtil jwtTokenUtil;

    @GetMapping("/auth/login")
    public String login(@RequestParam String publicAddress) {
        return authService.generateNonce(publicAddress);
    }

    @PostMapping("/auth/token")
    public String token(@RequestBody LoginRequest loginRequest) throws Exception {
        var user = authService.authenticate(loginRequest.getAddress(), loginRequest.getSig());
        return jwtTokenUtil.generateToken(user);
    }

}
