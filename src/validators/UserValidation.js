import { body, query } from "express-validator";
import User from "../models/User.js";

export class UserValidator {
    static login() {
        return [
            query('email').isEmail().custom(async (email, {req}) => {
                const user = await User.findOne({email:email})
                if(user){
                    req.user = user
                    return true
                }else{
                    throw new Error('User does not exist.')
                }
            }),
            query('password', 'Password is required')
        ]
    }
  static signup() {
    return [
      body("username", "Username is required").isString(),

      body("email", "Email is required")
        .isEmail()
        .custom(async (email, { req }) => {

            const user = await User.findOne({
                    email: email,
                  })
            if (user && user.verified) {
                throw new Error("User already verified");
            } else {
                return true;
            }
        }),

      body("password", "Password is required")
        .isAlphanumeric()
        .isLength({ min: 8, max: 20 })
        .withMessage("Password should be between 8 to 20 characters only"),
    ];
  }

  static verify() {
    return [
      body("verification_token", "Verification token is required").isNumeric(),

      body("email", "Email is required").isEmail(),
    ];
  }

  static resendVerificationEmail() {
      return[
          query('email').isEmail()
      ]
  }

  static updatePassword(){
    return [
      body('password', 'Password is required').isAlphanumeric(),
      body('confirm_password', 'Confirm Password is required').isAlphanumeric(),
      body('new_password', 'New Password is required').isAlphanumeric().custom((new_password, {req}) => {
        if(req.body.password !== req.body.confirm_password){
          req.errorStatus = 422
          throw new Error("password and confirm password should be same.")
        }
        else if(new_password === req.body.confirm_password){
          req.errorStatus = 422
          throw new Error('new password and old password cannot be same')
        }
        else{
          return true
        }
      })
    ]
  }

  static sendResetPasswordEmail() {
    return [
      query('email', 'Email is required').isEmail().custom((email, {req}) => {
        return User.findOne({
          email:email
        }).then((user) => {
          if(user){
            return true
          }else{
            throw new Error("Email does not exist")
          }
        })
      })
    ]
  }

  static verifyResetPasswordToken(){
    return [
      query('reset_password_token', 'Reset password token is required').isNumeric().custom(async (reset_password_token, {req})=> {
        const user = await User.findOne({
          reset_password_token:reset_password_token, 
          reset_password_token_time: {$gt: Date.now()}
        })
        if(user){
          req.user = user
          return true
        }else{
          throw new Error("Wrong reset token! Please request your token again")
        }
      })
    ]
  }

  static updateProfilePic(){
    return [
      body('profile_pic_url').custom((profile_pic_url, {req}) => {
        if(req.file){
          return true
        }else{
          throw new Error('File not uploaded')
        }
      })
    ]
  }

}
