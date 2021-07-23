import express from "express";
import {UserController} from "../controller/UserController.js";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware.js";
import { Utils } from "../utils/Utils.js";
import { UserValidator } from "../validators/UserValidation.js";

class UserRouter {
  constructor() {
    this.router = express.Router();
    this.getRoutes();
    this.postRoutes();
    this.patchRoutes()
  }

  getRoutes() {
    this.router.get("/login", UserValidator.login(), GlobalMiddleware.checkError, UserController.login);

    this.router.get("/send/verification/email", UserValidator.resendVerificationEmail(), GlobalMiddleware.checkError, GlobalMiddleware.authenticate, UserController.resendVerificationEmail);

    this.router.get('/reset/password', UserValidator.sendResetPasswordEmail(), GlobalMiddleware.checkError, UserController.sendResetPasswordEmail)

    this.router.get('/verify/resetPasswordToken', UserValidator.verifyResetPasswordToken(), GlobalMiddleware.checkError, UserController.verifyResetPasswordToken)
  }
  postRoutes() {
      this.router.post("/signup", UserValidator.signup(), GlobalMiddleware.checkError, UserController.signUp)
  }
  patchRoutes(){
    this.router.patch("/verify", UserValidator.verify(), GlobalMiddleware.checkError, GlobalMiddleware.authenticate, UserController.verify)

    this.router.patch("/update/password", GlobalMiddleware.authenticate, UserValidator.updatePassword(), GlobalMiddleware.checkError, UserController.updatePassword)

    this.router.patch('/update/profilePic', GlobalMiddleware.authenticate, new Utils().multer.single('profile_pic_url'), UserValidator.updateProfilePic(), GlobalMiddleware.checkError, UserController.updateProfilePic)
  }

 
}

const newUserRouter = new UserRouter();

export default newUserRouter.router;
