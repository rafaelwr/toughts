const User = require('../models/User')

const bcrypt = require('bcryptjs')
const flash = require('express-flash')
const session = require('express-session')

module.exports = class AuthController {

    static login(req, res) {
        res.render('auth/login')
    }

    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {
        const { name, email, password, confirmpassword } = req.body

        if (password != confirmpassword) {
            req.flash('message', 'As senhas não estão iguais. Tente novamente!')
            res.render('auth/register')

            return
        }

        const emailExists = await User.findOne({ where: { email } })

        if (emailExists) {
            req.flash('message', 'Este e-mail já está cadastrado!')
            res.render('auth/register')

            return false
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword
        }

        try {
            User.create(user)
                .then((user) => {
                    req.session.userid = user.id

                    req.flash('message', 'Cadastro realizado com sucesso!')

                    req.session.save(() => {
                        res.redirect('/')
                    })
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error);
        }
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }

}