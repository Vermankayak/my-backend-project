import { validationResult } from "express-validator";
import User from "../models/User.js";
import { Nodemailer } from "../utils/NodeMailer.js";
import { Utils } from "../utils/Utils.js";
import {jwt_secret} from '../environment/dev.env.js'
import Jwt from 'jsonwebtoken'

export class UserController {
  constructor() {}

  static login =  async (req, res, next) => {
    const encryptedPassword = req.user.password;
    const password = req.query.password;
    try{
    const msg = await Utils.validatePassword(password, encryptedPassword);
    const token = Jwt.sign({
      email:req.user.email,
      _id: req.user._id
    }, jwt_secret, {expiresIn: '120d'})
    res.json({
      token: token,
      user: req.user
    });
    }catch(e){
      console.log('i am here')
        return next(new Error(e))
    }
    
  
  };

  static signUp = async (req, res, next) => {
    try {
      const username = req.body.username;
      const email = req.body.email;
      const password = await Utils.encryptPassword(req.body.password);
      const verification_token = Utils.generateVerificationToken();
      let user = await User.findOneAndUpdate(
        {
          email: email,
        },
        {
          email: email,
          password: password,
          username: username,
          verification_token: verification_token,
          verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
        },
        { new: true, upsert: true }
      );

      Nodemailer.sendEmail({
        to: [email],
        subject: "Email Verification",
        html: `<h1>${verification_token}</h1>`,
      });
      res.send(user);
    } catch (e) {
      return next(new Error(e));
    }
  };

  static verify = async (req, res, next) => {
    const verificationToken = req.body.verification_token;
    const email = req.body.email;
    const user = await User.findOne({
      email: email,
      verification_token: verificationToken,
    }).exec();
    if (user === null) {
      const newError = new Error("User doesnt exist");
      next(newError);
    } else if (user.verified) {
      res.json({
        message: "user already verified",
        status_code: 200,
      });
    } else {
      const updatedUser = await User.findOneAndUpdate(
        {
          email: email,
          verification_token: verificationToken,
          verification_token_time: { $gt: Date.now() },
        },
        {
          verified: true,
          updated_at: new Date(),
        },
        { new: true }
      );

      if (updatedUser) {
        res.send(updatedUser);
      } else {
        return next(new Error(
          "Verification token is expired. Please request for a new one"
        ))
      }
    }
  };

  static resendVerificationEmail = async (req, res, next) => {
    const email = req.user.email;
    const verificationToken = Utils.generateVerificationToken();

    const user = await User.findOneAndUpdate(
      {
        email: email,
      },
      {
        email: email,
        verification_token: verificationToken,
        verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
      }
    );

    if (user === null) {
      throw Error("User Does Not Exist");
    } else {
      const msg = await Nodemailer.sendEmail({
        to: [email],
        subject: "Email Verification",
        html: `<h1>${verificationToken}</h1>`,
      });
      res.send(user);
    }
  };

  static updatePassword = async(req, res, next) => {
    
    const oldPassword = req.body.password
    try{
    const encryptedOldPassword = await User.findOne({
      email:req.user.email,
      _id:req.user._id
    }).password
  }catch(e){
    return next(new Error('User does not exist'))
  }

try{
  const validate = await Utils.validatePassword(oldPassword, encryptedPassword)
}catch(e){
  return next(e)
}
    const hashedPassword = await Utils.encryptPassword(req.body.new_password)

    const updatedUser = await User.findOneAndUpdate(
      {
        email:req.user.email,
        _id: req.user._id
      },
      {
        password: hashedPassword
      },
      {
        new:true
      }
      )
    
    res.send(updatedUser)
    
  }

  static async sendResetPasswordEmail() {
    const email = req.query.email
    const resetPasswordToken = Utils.generateVerificationToken()

    const updatedUser = User.findOneAndUpdate(
      {
        email:email
      },
      {
        reset_password_token:verification_token,
        reset_password_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
      },{
        new:true
      }
    )

    await Nodemailer.sendEmail({
      to:[email],
      subject: 'Reset Password email',
      html: `<h1>${resetPasswordToken}</h1>`
    })
    res.send(updatedU-ser)
  }

  static verifyResetPasswordToken(){
    res.json({
      success:true
    })
  }

  static async updateProfilePic(req, res, next) {
    const email = req.user.email
    const id = req.user._id
    const fileURL = 'http://localhost:5000/' + '/' + req.file.path

    try{
      const user = await User.findOneAndUpdate({
        email:email,
        _id:id  
      }, {
        profile_pic_url:fileURL
      }, {new:true})

      res.send(user)
    }catch(e) {

    }
  }
}
