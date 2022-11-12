const User = require('../models/User')

const bcrypt = require('bcryptjs')
const flash = require('express-flash')
const session = require('express-session')

module.exports = class AuthController {

    static login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {
        const { email, password } = req.body

        const user = await User.findOne({ where: { email } })

        if (!user) {
            req.flash('message', 'Usuário não encontrado!')
            res.render('auth/login')

            return
        }

        const passwordMath = bcrypt.compareSync(password, user.password)

        if (!passwordMath) {
            req.flash('message', 'Senha inválida. Tente novamente!')
            res.render('auth/login')

            return
        }

        req.session.userid = user.id

        req.session.save(() => {
            res.redirect('/')
        })
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