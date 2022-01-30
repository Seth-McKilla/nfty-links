package cc.nftlink.backend;

import cc.nftlink.backend.db.model.User;
import cc.nftlink.backend.db.repository.UserRepository;
import io.github.redouane59.twitter.TwitterClient;
import io.github.redouane59.twitter.signature.TwitterCredentials;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TwitterService {

    private
    @Value("${twitter.access.token}") String accessToken;
    private
    @Value("${twitter.access.token.secret}") String accessTokenSecret;
    private
    @Value("${twitter.api.key}") String apiKey;
    private
    @Value("${twitter.api.secret}") String apiSecret;

    private final UserRepository userRepository;
    TwitterClient twitterClient = new TwitterClient(TwitterCredentials.builder()
            .accessToken("940962950847791106-mPi9FHBsgFXHZSTR5iT7zgB9eiC53kp")
            .accessTokenSecret("IXCvDPr9yPkqxDtEFMZgo1mqea0IntjJQtRQAZzl0gdny")
            .apiKey("f4TlApLc3YKdKSUzolYyM1RGn")
            .apiSecretKey("ZvnqhPUVQOo9WtHkQHOown7sd245DwseTHeubI3ehfADwogsla")
            .build());

    public String getTweet() {
        var tweet =  twitterClient.getTweet("1487756749436239873");

        var user = twitterClient.getUserFromUserName("_gkris");
        var followers = twitterClient.getFollowers(user.getId());
        return followers.getData().get(0).getDisplayedName();
    }

    public String connect(User user, String twitterUsername) {
        var twitterUser = twitterClient.getUserFromUserName(twitterUsername);
        if (user.getTwitterChallengeText() == null) {
            String challengeText = "I'm authenticating my twitter account with https://nftlink.cc/ - Magic Link NFTs";
            user.setTwitterChallengeText(challengeText);
            user.setTwitterId(twitterUser.getId());
            user.setTwitterUsername(twitterUser.getName());
            userRepository.save(user);
            return challengeText;
        }
        if (Objects.equals(user.getTwitterChallengeText(), "Authenticated")) {
            return "Already connected";
        } else {
            if (this.verifyConnection(user)) {
                return "Connected";
            } else {
                return user.getTwitterChallengeText();
            }
        }
    }

    // get last 10 tweets from user and check if one contains the challenge text
    public boolean verifyConnection(User user) {
        var tweets = twitterClient.getUserTimeline(user.getTwitterId());
        for (var tweet : tweets.getData()) {
            if (tweet.getText().contains(user.getTwitterChallengeText().substring(0,28)) && tweet.getText().contains("https://nftlink.cc/")) {
                user.setTwitterChallengeText("Authenticated");
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }
}
