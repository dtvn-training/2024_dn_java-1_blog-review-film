package com.dac.BackEnd.security.jwt;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.dac.BackEnd.security.userprincal.UserPrinciple;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;

@Service
public class JwtProvider {

    @Value("${jwtSecret}")
    private String jwtSecret;

    @Value("${jwtExpiration}")
    private int jwtExpiration;
    
    private static final Logger logger = LoggerFactory.getLogger(JwtProvider.class);

    public String createToken(Authentication authentication){
        UserPrinciple userPrinciple = (UserPrinciple) authentication.getPrincipal();
        return Jwts.builder().setSubject(userPrinciple.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime()+jwtExpiration*1000))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public boolean validateToken(String token){
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.SignatureException e) {
            logger.error("Invalid JWT Signature: ", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT format token: ", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("Expired JWT token: ", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("Unsupported JWT token: ", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT Claims string is empty: ", e.getMessage());
        }
        return false;
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token)
                .getBody().getSubject();
    }
}
