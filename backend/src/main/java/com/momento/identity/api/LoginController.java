package com.momento.identity.api;

import com.momento.identity.api.request.LoginRequest;
import com.momento.identity.api.response.LoginResponse;
import com.momento.identity.application.service.LoginService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class LoginController {
    private final LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid
                                               @RequestBody LoginRequest loginRequest) {
        LoginResponse response = loginService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
}
