package cc.nftlink.backend.api;

import cc.nftlink.backend.TwitterService;
import cc.nftlink.backend.db.model.User;
import lombok.AllArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class TwitterController {

    private final TwitterService twitterService;

    @PostMapping("/connect/twitter/{username}")
    public String register(@PathVariable String username, @ApiIgnore @AuthenticationPrincipal User user) throws Exception {
        return twitterService.connect(user, username);
    }

    @PostMapping("/connect/twitter/verify")
    public boolean verify(@ApiIgnore @AuthenticationPrincipal User user)  {
        return twitterService.verifyConnection(user);
    }
}
