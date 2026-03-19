let express = require('express')
let router = express.Router()
let userController = require('../controllers/users')
let { RegisterValidator, validatedResult } = require('../utils/validator')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let fs = require('fs')
let path = require('path')
const { check } = require('express-validator')
const { checkLogin } = require('../utils/authHandler')

const privateKey = fs.readFileSync(path.join(__dirname, '../keys/private.pem'), 'utf8')

router.post('/register', RegisterValidator, validatedResult, async function (req, res, next) {
    let { username, password, email } = req.body;
    let newUser = await userController.CreateAnUser(
        username, password, email, '69b2763ce64fe93ca6985b56'
    )
    res.send(newUser)
})
router.post('/login', async function (req, res, next) {
    let { username, password } = req.body;
    let user = await userController.FindUserByUsername(username);
    if (!user) {
        res.status(404).send({
            message: "thong tin dang nhap khong dung"
        })
        return;
    }
    if (!user.lockTime || user.lockTime < Date.now()) {
        if (bcrypt.compareSync(password, user.password)) {
            user.loginCount = 0;
            await user.save();
            let token = jwt.sign({
                id: user._id,
            }, privateKey, {
                expiresIn: '1h',
                algorithm: 'RS256'
            })
            res.send(token)
        } else {
            user.loginCount++;
            if (user.loginCount == 3) {
                user.loginCount = 0;
                user.lockTime = new Date(Date.now() + 60 * 60 * 1000)
            }
            await user.save();
            res.status(404).send({
                message: "thong tin dang nhap khong dung"
            })
        }
    } else {
        res.status(404).send({
            message: "user dang bi ban"
        })
    }

})
router.get('/me',checkLogin, function (req,res,next) {
    res.send(req.user)
})

// Change Password endpoint
router.post('/changePassword', checkLogin, async function (req, res, next) {
    try {
        let { oldPassword, newPassword } = req.body;
        
        // Validate input
        if (!oldPassword || !newPassword) {
            return res.status(400).send({
                message: "oldPassword và newPassword là bắt buộc"
            })
        }
        
        // Validate newPassword strength
        if (newPassword.length < 6) {
            return res.status(400).send({
                message: "Mật khẩu mới phải có ít nhất 6 ký tự"
            })
        }
        
        // Check if newPassword contains at least one uppercase, one lowercase, one number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).send({
                message: "Mật khẩu mới phải chứa ít nhất một chữ hoa, một chữ thường và một số"
            })
        }
        
        // Get current user
        let user = req.user;
        
        // Check if old password is correct
        if (!bcrypt.compareSync(oldPassword, user.password)) {
            return res.status(401).send({
                message: "Mật khẩu cũ không chính xác"
            })
        }
        
        // Update password
        user.password = newPassword;
        await user.save();
        
        res.send({
            message: "Thay đổi mật khẩu thành công"
        })
    } catch (error) {
        res.status(500).send({
            message: "Lỗi server: " + error.message
        })
    }
})

module.exports = router;