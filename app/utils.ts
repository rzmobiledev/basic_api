
import bcrypt from "bcryptjs";
const dotenv = require("dotenv");
import {Request, Response} from "express";
const User = require("../models").User;
const jwt = require("jsonwebtoken");

dotenv.config();

const MIN_PASSWORD_LENGTH: number = 6;
const SALT_GENERATED: string = "$2a$10$2Ypm83LxkRXIKcXfr4sbN.";

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
                // generate token here
                const token = generateJWTToken(email);
                return res.status(200).send({token});
            }
            else {
                return res.status(400).send({message: "Passwords do not match"})
            }
        });
    } else {
        return res.status(401).send({message: "You are unauthorized!"})
    }
}


function generateJWTToken(key: string | number) {
    return jwt.sign(
        {
            key: key
        }, 
        process.env.SECRET_KEY,
        {
            expiresIn: "120"
        }
    );
        
}