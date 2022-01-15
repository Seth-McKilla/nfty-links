package cc.nftlink.backend;

import cc.nftlink.backend.db.model.Nft;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.Data;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class IpfsService {

    @Value("${nft.storage.api.key}")
    private String apiKey;
    @Value("${nft.storage.api.url}")
    private String apiUrl;
    /*
    Method creates json object that is compliant with erc721 token metadata spec
    Then it uploads json object to ipfs and returns its hash
     */
    public String createIpfsRecord(Nft nft) {
        Map<String, String> properties = new HashMap<>();
        properties.put("name", nft.getName());
        properties.put("description", nft.getDescription());
        properties.put("image", nft.getImage());
        Erc721Metadata erc721Metadata = Erc721Metadata.builder().title("NftLink").type("Nft").properties(properties).build();
        // create http request to ipfs
        OkHttpClient client = new OkHttpClient();

        ObjectMapper mapper = new ObjectMapper();
        try {
            // convert user object to json string and return it
            var jsonBody = mapper.writeValueAsString(erc721Metadata);
            MediaType JSON = MediaType.parse("application/json; charset=utf-8");
            // put your json here
            RequestBody body = RequestBody.create(JSON, jsonBody);
            Request request = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + apiKey)
                    .url(apiUrl + "/upload")
                    .post(body)
                    .build();
            Response response = null;
            try {
                response = client.newCall(request).execute();
                String resStr = response.body().string();
                return resStr;
            } catch (IOException e) {
                e.printStackTrace();
                throw new RuntimeException("Error while uploading to ipfs");
            }
        } catch (JsonProcessingException e) {
            // catch various errors
            e.printStackTrace();
            throw new RuntimeException("Error while converting to json");
        }
    }

    @Data
    @Builder
    private static class Erc721Metadata {
        private String title;
        private String type;
        private Map<String, String> properties;
    }


    /*
    ERC721 Metadata JSON Schema
    {
    "title": "Asset Metadata",
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "description": "Identifies the asset to which this NFT represents"
        },
        "description": {
            "type": "string",
            "description": "Describes the asset to which this NFT represents"
        },
        "image": {
            "type": "string",
            "description": "A URI pointing to a resource with mime type image/* representing the asset to which this NFT represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive."
        }
    }
}
     */
}
