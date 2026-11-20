
package com.momento.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import io.jsonwebtoken.JwtException;

import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        String path = request.getServletPath();

        if (path.equals("/api/auth/social")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Check Authorization header
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract JWT token
        final String token = authHeader.substring(7);

        // Extract email from token
        final String email;

        try {
            email = jwtService.extractUsername(token);
            if (!jwtService.isTokenValid(token, email)) {
                filterChain.doFilter(request, response);
                return;
            }
        } catch (JwtException | IllegalArgumentException exception) {
            filterChain.doFilter(request, response);
            return;
        }

        // Authenticate user if not already authenticated
        if (email != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            final UserDetails userDetails;
            try {
                userDetails = userDetailsService.loadUserByUsername(email);
            } catch (UsernameNotFoundException exception) {
                filterChain.doFilter(request, response);
                return;
            }

            if (userDetails.isEnabled()) {

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getServletPath();

        return path.equals("/api/auth/social")
                || path.equals("/api/auth/refresh")
                || path.equals("/api/auth/logout");
    }

}
