package com.licenta.clinic.service;

import com.licenta.clinic.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class JwtService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final String HEADER_JSON = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";

    @Value("${clinic.security.jwt.secret:licenta-clinica-default-secret-change-in-production-2026}")
    private String jwtSecret;

    @Value("${clinic.security.jwt.expiration-ms:86400000}")
    private long expirationMs;

    public String generateToken(User user) {
        long issuedAt = Instant.now().getEpochSecond();
        long expiresAt = issuedAt + expirationMs / 1000;

        String payloadJson = "{"
                + "\"sub\":\"" + escapeJson(user.getId()) + "\","
                + "\"email\":\"" + escapeJson(user.getEmail()) + "\","
                + "\"role\":\"" + escapeJson(user.getRole()) + "\","
                + "\"iat\":" + issuedAt + ","
                + "\"exp\":" + expiresAt
                + "}";

        String encodedHeader = encode(HEADER_JSON.getBytes(StandardCharsets.UTF_8));
        String encodedPayload = encode(payloadJson.getBytes(StandardCharsets.UTF_8));
        String unsignedToken = encodedHeader + "." + encodedPayload;

        return unsignedToken + "." + sign(unsignedToken);
    }

    public boolean isValid(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return false;
            }

            String unsignedToken = parts[0] + "." + parts[1];
            String expectedSignature = sign(unsignedToken);

            if (!MessageDigest.isEqual(
                    expectedSignature.getBytes(StandardCharsets.UTF_8),
                    parts[2].getBytes(StandardCharsets.UTF_8)
            )) {
                return false;
            }

            Long expiration = getLongClaim(token, "exp");
            if (expiration == null) {
                return false;
            }

            return expiration > Instant.now().getEpochSecond();
        } catch (Exception e) {
            return false;
        }
    }

    public String getUserId(String token) {
        return getStringClaim(token, "sub");
    }

    private String getStringClaim(String token, String claim) {
        Matcher matcher = Pattern
                .compile("\"" + claim + "\"\\s*:\\s*\"([^\"]*)\"")
                .matcher(getPayloadJson(token));

        return matcher.find() ? matcher.group(1) : null;
    }

    private Long getLongClaim(String token, String claim) {
        Matcher matcher = Pattern
                .compile("\"" + claim + "\"\\s*:\\s*(\\d+)")
                .matcher(getPayloadJson(token));

        if (!matcher.find()) {
            return null;
        }

        return Long.parseLong(matcher.group(1));
    }

    private String getPayloadJson(String token) {
        String[] parts = token.split("\\.");
        byte[] payloadBytes = Base64.getUrlDecoder().decode(parts[1]);
        return new String(payloadBytes, StandardCharsets.UTF_8);
    }

    private String encode(byte[] value) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(value);
    }

    private String escapeJson(String value) {
        return value == null ? "" : value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private String sign(String value) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            SecretKeySpec key = new SecretKeySpec(
                    jwtSecret.getBytes(StandardCharsets.UTF_8),
                    HMAC_ALGORITHM
            );
            mac.init(key);

            byte[] signature = mac.doFinal(value.getBytes(StandardCharsets.UTF_8));
            return encode(signature);
        } catch (Exception e) {
            throw new RuntimeException("Could not sign JWT", e);
        }
    }
}
