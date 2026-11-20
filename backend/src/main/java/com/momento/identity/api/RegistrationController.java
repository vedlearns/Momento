package com.momento.identity.api;

import com.momento.common.response.ApiResponse;
import com.momento.identity.api.request.RegisterRequest;
import com.momento.identity.application.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class RegistrationController {
    private final RegistrationService registrationService;
    public RegistrationController(RegistrationService registrationService){
        this.registrationService = registrationService;
    }
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid
                                                    @RequestBody RegisterRequest request){
        registrationService.register(request.name(),
                request.email(),
                request.password());
        ApiResponse apiResponse = new ApiResponse("Momento","SUCCESS","User registered Successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }
}
