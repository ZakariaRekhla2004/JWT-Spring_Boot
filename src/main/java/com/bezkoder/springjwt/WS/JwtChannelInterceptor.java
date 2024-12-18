package com.bezkoder.springjwt.WS;

import com.bezkoder.springjwt.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class JwtChannelInterceptor implements ChannelInterceptor {


    private  JwtUtils jwtTokenProvider;
    public JwtChannelInterceptor(JwtUtils jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }


    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authToken = accessor.getFirstNativeHeader("Authorization");

            if (authToken != null && authToken.startsWith("Bearer ")) {
                String token = authToken.substring(7);
                try {
                    // Validate token
                    if (jwtTokenProvider.validateJwtToken(token)) {
                        // Get authentication
                        Authentication authentication =
                                jwtTokenProvider.getAuthentication(token);

                        // Set authentication
                        accessor.setUser(authentication);
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    } else {
                        // Log or handle invalid token
                        throw new IllegalArgumentException("Invalid JWT token");
                    }
                } catch (Exception e) {
                    // Log the error
                    throw new RuntimeException("Authentication error", e);
                }
            }
        }
        return message;
    }
}