package com.nashtech.MyBikeShop.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nashtech.MyBikeShop.DTO.PersonDTO;
import com.nashtech.MyBikeShop.entity.PersonEntity;
import com.nashtech.MyBikeShop.payload.request.LoginRequest;
import com.nashtech.MyBikeShop.payload.response.JwtResponse;
import com.nashtech.MyBikeShop.payload.response.MessageResponse;
import com.nashtech.MyBikeShop.repository.PersonRepository;
import com.nashtech.MyBikeShop.security.JWT.JwtUtils;
import com.nashtech.MyBikeShop.security.services.UserDetailsImpl;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

	final private AuthenticationManager authenticationManager;

	final private PersonRepository personRepository;

	final private PasswordEncoder encoder;

	final private JwtUtils jwtUtils;

	public AuthController(AuthenticationManager authenticationManager, PersonRepository personRepository,
			PasswordEncoder encoder, JwtUtils jwtUtils) {
		this.authenticationManager = authenticationManager;
		this.personRepository = personRepository;
		this.encoder = encoder;
		this.jwtUtils = jwtUtils;
	}

	@Operation(summary = "Log in to get Authorize")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Login Success!", content = {
					@Content(mediaType = "application/json", schema = @Schema(implementation = LoginRequest.class)) }),
			@ApiResponse(responseCode = "400", description = "Bad Request : JSON missing elements", content = @Content),
			@ApiResponse(responseCode = "401", description = "Unauthorized, Login Failed!", content = @Content),
			@ApiResponse(responseCode = "404", description = "Login not found", content = @Content),
			@ApiResponse(responseCode = "405", description = "Method not allow. Using POST to Login", content = @Content) })
	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

		// if go there, the user/password is correct
		SecurityContextHolder.getContext().setAuthentication(authentication);
		// generate jwt to return to client
		String jwt = jwtUtils.generateJwtToken(authentication);

		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
		List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
				.collect(Collectors.toList());
		return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getName(), userDetails.getEmail(), roles));
	}

	@Operation(summary = "Sign up to get Authorize")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Registered successfully!", content = {
					@Content(mediaType = "application/json", schema = @Schema(implementation = LoginRequest.class)) }),
			@ApiResponse(responseCode = "400", description = "Bad Request: Invalid syntax", content = @Content),
			@ApiResponse(responseCode = "404", description = "Can not find the requested resource", content = @Content),
			@ApiResponse(responseCode = "405", description = "Method not allow. Using POST to Login", content = @Content) })
	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody PersonDTO signUpRequest) {

		if (personRepository.existsByEmail(signUpRequest.getEmail())) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
		}

		// Create new user's account
//		UserEntity user = new UserEntity(signUpRequest.getEmail(), encoder.encode(signUpRequest.getPassword()),
//				signUpRequest.getFullname(),signUpRequest.getRole());
		signUpRequest.setPassword(encoder.encode(signUpRequest.getPassword()));
		PersonEntity user = new PersonEntity(signUpRequest);
		personRepository.save(user);

		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
	}
	
	@GetMapping("/logout")
	public String logOut(HttpServletRequest request) {
		String token = request.getHeader("Authorization");
		String[] arrStr = token.split(" ");
		token = arrStr[1];
		jwtUtils.refreshToken(token);
		return "SUCCESS";
		
	}
}
