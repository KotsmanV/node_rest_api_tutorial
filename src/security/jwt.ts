import * as jwt from 'jsonwebtoken'
import { User } from '../entity/User';
import { v4 as uuidv4 } from 'uuid';
import { RefreshToken } from '../entity/RefreshToken';
import moment = require('moment');
import { Database } from '../dataAccess/database';
import { Jwt } from 'jsonwebtoken';
import { environment } from '../../environment';

class JWT {
    public static async generateToken(user: User) {
        const payload = {
            id: user.id,
            email: user.email
        }

        const jwtId = uuidv4();
        const token = jwt.sign(payload, environment.jwt_secret, {
            expiresIn: "1h",
            jwtid: jwtId, // needed for the refresh token
            subject: user.id.toString()
        })

        const refreshToken = await this.generateRefreshToken(user,jwtId);

        return { token, refreshToken};
    }

    private static async generateRefreshToken(user: User, jwtId: string) {
        const refreshToken = new RefreshToken(
            user,
            jwtId,
            moment().add(10, `d`).toDate()
        );

        await Database.tokenRepo.save(refreshToken);
        return refreshToken.id;
    }

    public static isTokenValid(token:string){
        try {
            return jwt.verify(token,environment.jwt_secret, {
                ignoreExpiration:false
            });
        } catch (error) {
            return false;
        }
    }

    public static getDecodedToken(token:string):Jwt |undefined{
        try {
            let decoded = jwt.decode(token,{complete:true});
            console.log(decoded);
            return decoded
        } catch (error) {
            return null;
        }
    }

    public static async fetchRefreshToken(refreshTokenId:string){
        return await Database.tokenRepo.findOneBy({id:refreshTokenId});
    }

    public static isTokenAndRefreshTokenMatched(refreshTokenId:string,jwtId:string){
        return refreshTokenId === jwtId ? true : false;
    }
    public static hasTokenExpired(refreshToken: RefreshToken) {
        return moment().isAfter(refreshToken.expiryDate);        
    }
    public static isRefreshTokenUsedOrInvalidated(refreshToken: RefreshToken) {
        return refreshToken.used || refreshToken.invalidated ? true : false;
    }
}

export {
    JWT
}