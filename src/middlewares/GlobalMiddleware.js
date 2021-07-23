import {validationResult} from 'express-validator'
import { jwt_secret } from '../environment/dev.env.js';
import Jwt from 'jsonwebtoken'

export class GlobalMiddleware{

    static checkError = (req, res, next) => {
        
        const error = validationResult(req);
        if (!error.isEmpty()) {
            const newError = new Error(error.array()[0].msg);
            return next(newError);
        }else{
            return next()
        }

    }

    static async authenticate(req, res, next) {
        const authHeader = req.headers.authorization;
        const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
        Jwt.verify(token, jwt_secret, (err, decoded) => {
            if(err){
                return next(new Error(err))
            }else if(!decoded){
                return next(new Error('User not authorized'))
            }else{
                req.user = decoded
                next()
            }
        })
    }
}