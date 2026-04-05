package com.afyaflow.demo.security;

import com.afyaflow.demo.model.AuthProvider;
import com.afyaflow.demo.model.Role;
import com.afyaflow.demo.model.User;
import com.afyaflow.demo.repository.RoleRepository;
import com.afyaflow.demo.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RoleRepository roleRepository;

    public OAuth2LoginSuccessHandler(UserRepository userRepository, JwtService jwtService, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.roleRepository = roleRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        
        if (email == null) {
            email = oAuth2User.getAttribute("preferred_username"); // Fallback for some MS entra setups
        }
        
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            // Auto-register the new user
            Role defaultRole = roleRepository.findByName("USER").orElseGet(() -> {
                Role r = new Role();
                r.setName("USER");
                return roleRepository.save(r);
            });

            user = new User();
            user.setUsername(name != null ? name : (email != null ? email.split("@")[0] : "unknown"));
            user.setEmail(email);
            user.setRole(defaultRole);
            user.setAuthProvider(AuthProvider.GOOGLE); // Defaulting for simple impl, ideally dynamically detect based on registrationId
            userRepository.save(user);
        }

        String token = jwtService.generateToken(user);
        
        // Redirect back to frontend with the token
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/oauth2/callback")
                .queryParam("token", token)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
