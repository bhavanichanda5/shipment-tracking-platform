package com.shiptrack.auth.service;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService     
{
    private static final String SECRET_KEY = 
                                             "mySecretKeyForJwtAuthentication12345678901234567890";  

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    public String generateToken(String username) {

    return Jwts.builder()                                                                                                //This starts building a new JWT
            .subject(username)                                                                                           //Who owns this token?
            .issuedAt(new Date())                                                                                       //When was the token created?
            .expiration(new Date(System.currentTimeMillis() + 86400000))                        //When will the token expire? (1 day in milliseconds)      86400000 milliseconds = 24 hrs ,So the token expires after 24 hours.
            .signWith(key, SignatureAlgorithm.HS256)                                                        //this is used to sign the JWT using the specified algorithm and key. This ensures that the token cannot be tampered(manipulate) with
            .compact();                                                                                                         //This finalizes the building process and returns the JWT as a string

}
}
