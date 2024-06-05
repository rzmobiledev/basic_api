import {Request, Response} from "express";
import {
    isPasswordLengthSatisfied, 
    isAllUserFieldsSatisfied, 
    checkEmailIfExists, 
    encryptUserPassword,
    compareUserPassword,
} from "../app/utils"
const User = require("../models").User;


module.exports = {
    list(req: Request, res: Response) {
        return User
        .findAll({
            include: [],
            order:[
                ["createdAt", "DESC"],
            ]
        }).
        then((user: typeof User) => res.status(200).send(user))
        .catch((err: Error) => res.status(400).send(err))
    },

    getById(req: Request, res: Response){
        return User
        .findByPk(req.params.id)
        .then((user: typeof User) => res.status(200).send(user))
        .catch((err: Error) => res.status(400).send({
            message: err
        }))
    },

    async addUser(req:Request, res: Response): Promise<any> {

        const firstName: string = req.body.firstName,
        lastName: string = req.body.lastName,
        email: string = req.body.email,
        password: string = req.body.password
        
        if(!isAllUserFieldsSatisfied(firstName, lastName, email, password)){
            return res.status(400).send({message: "All fields should not empty"});
        }

        if(!isPasswordLengthSatisfied(password)){
            return res.status(400).send({message: "Your password at least min 7 chars length"});
        }

        const emailExist = await checkEmailIfExists(email);
        
        if(emailExist) {
            return res.status(401).send({message: "This email is already registered."});
        } 

        return User
        .create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        })
        .then(async (user: typeof User) => {
            await encryptUserPassword(req, res, user)
        })
        .catch((err: Error) => res.status(400).send(err))
    },

    changeUser(req: Request, res: Response){
        return User
        .findByPk(req.params.id)
        .then((user: typeof User) => {
            if(!user){
                return res.status(404).send({
                    message: "User Not Found."
                })
            }
            return user
            .update({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password
            })
            .then(() => res.status(200).send(user))
            .catch((err: Error) => res.status(400).send({message: err}))
        })
        .catch((err: Error) => res.status(400).send({message: err}))
    },

    async login(req: Request, res: Response){
        await compareUserPassword(req, res);
    }
}