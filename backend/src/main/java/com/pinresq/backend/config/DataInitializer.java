package com.pinresq.backend.config;

import com.pinresq.backend.model.User;
import com.pinresq.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    /**
     * Seeds a dev user on startup if the users table is empty.
     * This ensures the "Quick Dev Access" bypass (userId=1) always has a
     * matching DB record, so report creation and volunteer toggle work.
     */
    @Bean
    public CommandLineRunner seedDevUser(UserRepository userRepository,
                                         PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User devUser = new User();
                devUser.setName("Jay Jaiswal");
                devUser.setEmail("jay@pinresq.dev");
                devUser.setPassword(passwordEncoder.encode("devpass123"));
                devUser.setPhone("+91 98765 43210");
                devUser.setVolunteerMode(false);
                User saved = userRepository.save(devUser);
                System.out.println("✅ Dev user seeded with ID: " + saved.getId());
            }
        };
    }
}
