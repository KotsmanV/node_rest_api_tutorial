import * as bcrypt from 'bcrypt';


class PasswordHash {
    /**
     * 
     * @param plainPassword Plain password
     * @returns Returns a hashed password
     */
    public static async hashPassword(plainPassword: string) {
        const salt = await bcrypt.genSalt(10);
        // const hashedPass = await bcrypt.hash(plainPassword,salt);
        // return hashedPass;

        const hashedPass = await new Promise<string>((resolve, reject) => {
            bcrypt.hash(plainPassword, salt, function (err, hash) {
                err ? reject(err) : resolve(hash);
            });
        })
        return hashedPass;
    }

    public static async isPasswordValid(plainPassword:string, hashedPassword:string){
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

export {
    PasswordHash
}