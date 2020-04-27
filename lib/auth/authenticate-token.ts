import * as jwt from 'jsonwebtoken';

class AuthenticateToken {
    constructor() {
    }

    generateAccessToken(obj) {
        return jwt.sign(obj, process.env.AUTH_KEY, {});
    }

    authenticate() {
        //next();
        // const authHeader = req.headers['authorization']
        // const token = authHeader && authHeader.split(' ')[1]
        // if (token == null) return res.sendStatus(401) // if there isn't any token

        // jwt.verify(token, process.env.AUTH_KEY as string, (err: any, user: any) => {
        //     console.log(err)
        //     if (err) return res.sendStatus(403)
        //     req.user = user
        //     next(); // pass the execution off to whatever request the client intended
        // });

        // const token = jwt.sign({}, process.env.AUTH_KEY, {});
        // const { password, ...userWithoutPassword } = token;
        // return {
        //     ...userWithoutPassword,
        //     token
        // };
    }
}

export default new AuthenticateToken();