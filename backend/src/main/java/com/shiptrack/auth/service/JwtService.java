package com.shiptrack.auth.service;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;


@Service
public class JwtService     
{
    private static final String SECRET_KEY = 
                                             "mySecretKeyForJwtAuthentication12345678901234567890";  

    private final SecretKey key =
        Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    public String generateToken(String username) 
    {

    return Jwts.builder()                                                                                                //This starts building a new JWT
            .subject(username)                                                                                           //Who owns this token?
            .issuedAt(new Date())                                                                                       //When was the token created?
            .expiration(new Date(System.currentTimeMillis() + 86400000))                        //When will the token expire? (1 day in milliseconds)      86400000 milliseconds = 24 hrs ,So the token expires after 24 hours.
            .signWith(key, SignatureAlgorithm.HS256)                                                        //this is used to sign the JWT using the specified algorithm and key. This ensures that the token cannot be tampered(manipulate) with
            .compact();                                                                                                         //This finalizes the building process and returns the JWT as a string

    }

    public String extractUsername(String token) {

    return extractAllClaims(token).getSubject();

    }

   private Claims extractAllClaims(String token) {

        Jws<Claims> claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token);

    return claims.getPayload();

    }

    public Date extractExpiration(String token) {

    return extractAllClaims(token).getExpiration();

    }

    public boolean isTokenValid(String token, String username) {

    String extractedUsername = extractUsername(token);

    return extractedUsername.equals(username)
            && !extractExpiration(token).before(new Date());

    }
}
