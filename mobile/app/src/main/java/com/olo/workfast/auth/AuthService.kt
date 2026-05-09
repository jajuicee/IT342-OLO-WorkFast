package com.olo.workfast.auth

import com.olo.workfast.auth.model.AuthResponse
import com.olo.workfast.auth.model.LoginRequest
import com.olo.workfast.auth.model.RegisterRequest
import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthService {
    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<ResponseBody>

    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>
}
