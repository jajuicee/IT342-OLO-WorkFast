package com.olo.workfast.models

data class RegisterRequest(val name: String, val email: String, val password: String)
data class LoginRequest(val email: String, val password: String)
data class AuthResponse(val message: String?, val name: String?, val email: String?, val token: String? = null)