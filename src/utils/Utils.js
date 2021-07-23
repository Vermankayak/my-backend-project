import bcrypt from 'bcrypt'
import multer from 'multer'


const storageOptions = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads') //its error first pattern, where first arugument is null or error and second argument is the location where we want to store the picture uploaded on our server folder src/uploads, we could use any remote server like s3.
    },
    filename:function(req, file, cb){
        cb(null, file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

export class Utils{
    
    constructor(){
        this.MAX_TOKEN_TIME = 60000
        this.multer = multer({
            storage: storageOptions,
            fileFilter: fileFilter
        })
    }

    static generateVerificationToken() {
        let size = 5;
        let digits = '0123456789';
        let otp = ''
        for (let i = 0; i < size; i++) {
            otp += digits[Math.floor(Math.random() * 10)]
        }
        return parseInt(otp)
    }


    static encryptPassword(password) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if(err){
                    reject(err)
                }else{
                    resolve(hash)
                }
            })
        })
    }

    static validatePassword(password, encryptedPassword){
       return new Promise((resolve, reject) => {
        bcrypt.compare(password, encryptedPassword, (err, isSame) => {
            if(err) {
                reject(err)
            }else if(!isSame){
                reject('incorrect password')
            }else{
                resolve(true)
            }
        })
    })
    }
        
}