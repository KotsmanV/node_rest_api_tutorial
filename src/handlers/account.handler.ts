import { Database } from "../dataAccess/database";
import { LoginDto } from "../dto/request/login.dto";
import { RefreshTokenDto } from "../dto/request/refreshToken.dto";
import { RegisterDto } from "../dto/request/register.dto";
import { AuthenticationDto } from "../dto/response/authentication.dto";
import { ApiResponse } from "../dto/response/response.dto";
import { UserDto } from "../dto/response/user.dto";
import { User } from "../entity/User";
import { JWT } from "../security/jwt";
import { PasswordHash } from "../security/passwordHasher";

async function registerUser(requestBody:RegisterDto){
    if (requestBody.password !== requestBody.repeatPassword) {
        return new ApiResponse(400,undefined,[`Repeat password does not match password!.`]);
    }

    let existingUser = await Database.userRepo.findOne({
        where: {
            email: requestBody.email
        }
    });
    
    if (existingUser) {
        return new ApiResponse(400,undefined,[`Email already in use.`]);
    }

    let pass = await PasswordHash.hashPassword(requestBody.password);
    const user = new User(
        requestBody.username,
        requestBody.email,
        pass,
        requestBody.age
    );
    await Database.userRepo.save(user);

    const tokenObj = await JWT.generateToken(user);
    const authResponse: AuthenticationDto = new AuthenticationDto(
        new UserDto(user.id, user.userName, user.email, user.age),
        tokenObj.token,
        tokenObj.refreshToken
    );
    return new ApiResponse(200,authResponse);
}

async function login(requestBody:LoginDto){
    if (!requestBody.email && !requestBody.password) {
        return new ApiResponse(400,undefined,[`Provide an email and password.`]);
    }
    const user: User = await Database.userRepo.findOneBy({ email: requestBody.email });
    if (!user) {
        return new ApiResponse(400,undefined,[`User does not exist.`]);
    }

    let isPasswordValid = await PasswordHash.isPasswordValid(requestBody.password, user.password);
    if (!isPasswordValid) {
        return new ApiResponse(400,undefined,[`User credentials not valid.`]);
    }
    
    const userDto: UserDto = new UserDto(user.id, user.userName, user.email);
    const { token, refreshToken } = await JWT.generateToken(user);
    const authDto = new AuthenticationDto(userDto, token, refreshToken);
    return new ApiResponse(200,authDto);
}

async function refreshToken(requestBody:RefreshTokenDto){
    const isTokenValid = JWT.isTokenValid(requestBody.token);

    if (!isTokenValid) {
        return new ApiResponse(401,undefined,[`Unauthorized:Token not valid`]);
    }
    const token = JWT.getDecodedToken(requestBody.token);
    if (!token) {
        return new ApiResponse(401,undefined,[`Unauthorized:Decoded token not valid`]);
    }

    const refreshToken = await JWT.fetchRefreshToken(requestBody.refreshToken);
    if (!refreshToken) {
        return new ApiResponse(401,undefined,[`Unauthorized:Refresh token does not exist`]);
    }

    if (!JWT.isTokenAndRefreshTokenMatched(refreshToken.jwtId, token.payload[`jti`])) {
        return new ApiResponse(401,undefined,[`Unauthorized:Refresh token id and token id do not match`]);
    }

    if (JWT.hasTokenExpired(refreshToken)) {
        return new ApiResponse(401,undefined,[`Unauthorized:Token expired`]);
    }

    if (JWT.isRefreshTokenUsedOrInvalidated(refreshToken)) {
        return new ApiResponse(401,undefined,[`Unauthorized:Refresh token used or invalidated`]);
    }

    refreshToken.used = true;
    await Database.tokenRepo.save(refreshToken);
    const user = await Database.userRepo.findOneBy({ id: parseInt(token.payload[`id`]) });
    if (!user) {
        return new ApiResponse(401,undefined,[`User not found`]);
    }

    const newToken = await JWT.generateToken(user);
    const authDto = new AuthenticationDto(new UserDto(user.id, user.userName, user.email), newToken.token, newToken.refreshToken);
    return new ApiResponse(200,authDto);
}

export{
    registerUser,
    login,
    refreshToken
}