package com.momento.identity.api.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 50, message = "Name must be contain least 2 to 50 characters")
        String name,
        @NotBlank(message = "Email is required")
        @Email(message = "please provide valid email address")
        String email,
        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 100, message = "Password must contain least 8 to 50 characters")
        String password
) {
}
