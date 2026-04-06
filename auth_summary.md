# Mobile Authentication Summary: WorkFast

This summary outlines the registration and login processes within the WorkFast mobile application, specifically focusing on the Android implementation and its integration with the backend API.

## 1. How Registration Works
The registration process allows new users to create an account by providing their basic information.

- **User Interface**: Handled by `RegisterActivity.kt` and `activity_register.xml`. It includes input fields for **Full Name**, **Email Address**, and **Password**.
- **Client-Side Validation**:
    - **Empty Fields**: Ensures all fields are filled before submitting.
    - **Email Format**: Uses Android's `EMAIL_ADDRESS` pattern to verify the email is valid.
    - **Password Security**: Enforces a minimum length of 6 characters.
- **Process Flow**:
    1. The user enters their details and clicks the "Register" button.
    2. The app performs local validation.
    3. If valid, it sends a `RegisterRequest` (containing name, email, and password) to the backend.
    4. Upon a successful `200 OK` response, a success message is displayed via a Toast notification.
    5. The app automatically navigates the user back to the Login screen.

## 2. How Login Works
The login process authenticates existing users to grant access to the application's main features.

- **User Interface**: Handled by `LoginActivity.kt` and `activity_login.xml`. It includes input fields for **Email** and **Password**, plus a link to the registration screen.
- **Client-Side Validation**:
    - Verifies that fields are not empty and that the email format is correct.
- **Process Flow**:
    1. The user enters credentials and clicks "Log In".
    2. The app sends a `LoginRequest` to the backend.
    3. The backend validates credentials and returns an `AuthResponse` containing a success message and the user's name.
    4. Upon successful authentication:
        - The app displays a "Welcome, [Name]!" message.
        - The user is navigated to the `MainActivity`.
        - `LoginActivity` is removed from the back stack (`finish()`) to prevent returning to it via the back button.

## 3. API Integration (Mobile App)
The mobile app communicates with the backend server using modern Android networking libraries.

- **Networking Library**: **Retrofit 2** is used as the HTTP client, providing a type-safe interface for API calls.
- **Data Parsing**: **GSON Converter** is integrated with Retrofit to automatically handle JSON serialization and deserialization.
- **Base URL**: `http://10.0.2.2:8080/` (This specific IP is used by the Android Emulator to access the `localhost` of the host development machine).
- **Endpoints Used**:
    - `POST /api/auth/register`: Accepts a JSON object with `name`, `email`, and `password`.
    - `POST /api/auth/login`: Accepts a JSON object with `email` and `password`; returns a response object with a message and user profile data.
- **Concurrency**: API calls are executed asynchronously within Kotlin **Coroutines** (`lifecycleScope.launch`) to ensure the UI remains responsive during network operations.
