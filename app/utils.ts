
import bcrypt from "bcryptjs";
const dotenv = require("dotenv");
import {NextFunction, Request, Response} from "express";
const User = require("../models").User;
const jwt = require("jsonwebtoken");

dotenv.config();

const MIN_PASSWORD_LENGTH: number = 6;
const SALT_GENERATED: string = String(process.env.SALT_GENERATED);

export function isPasswordLengthSatisfied(myPassword: string): boolean {
    return myPassword.length > MIN_PASSWORD_LENGTH;
}

export function isAllUserFieldsSatisfied(firstName: string, lastName: string, email: string, password: string): boolean {
    if(firstName && lastName && email && password) {
        return true;
    }
    return false;
}

export async function checkEmailIfExists(email: string): Promise<boolean> { 
        const userExists = await User.findOne({
            where: {email: email}
        });
        return Boolean(userExists);
    }

export async function encryptUserPassword(req: Request, res: Response, user: typeof User): Promise<void>{
    const { password } = req.body;
    
    bcrypt.hash(password, SALT_GENERATED, (err, hash) => {
        if(err){
            return res.status(401).send({message: "Error when encrypting password"})
        }

        user.update({
            password: hash
        })
        .then((user: typeof User) => res.status(200).send(user))
        .catch((err: Error) => res.status(400).send({message: err}));
    });
}

export async function compareUserPassword(req: Request, res: Response){
    const { email, password  } = req.body;
    const userExists = await User.findOne({
        where: { email: email}
    })

    if(userExists){
        const hashed_password = userExists.dataValues?.password;

        bcrypt.compare(password, hashed_password, (err, result) => {
            if(err){
                return res.status(400).send({message: "Error comparing password:", err})
            }
            if(result){
                const token = generateJWTToken(email);
                return res.status(200).send({token});
            }
            else {
                return res.status(400).send({message: "Passwords do not match"})
            }
        });
    } else {
        return res.status(401).send({message: "You are unauthorized!"});
    }
}

export async function verifyToken(req: Request, res: Response, next: NextFunction){
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if(!token) return res.status(403).json({message: "Access Denied!"});
   
    try{
        await decodeJWTToken(token);
        next();
    } catch(err){
        res.status(401).json({message: err}); 
    }
}


function generateJWTToken(key: string | number) {
    return jwt.sign(
        {
            key: key
        }, 
        process.env.SECRET_KEY,
        {
            expiresIn: 60 * 5, //expires in 5 mins
            algorithm: "HS256",
        }
    );
}

type decodedKeyParams = {
    key: string;
}

type jwtError = {
    message: {
        name?: string;
        message?: string,
        expiredAt?: string;
    }
}

async function decodeJWTToken(token: string): Promise<string|object> {
    return await jwt.verify(token, process.env.SECRET_KEY, (err: jwtError, decoded: decodedKeyParams) => {
        if(err) throw ("Your token expired.");
        return decoded.key
    })
}