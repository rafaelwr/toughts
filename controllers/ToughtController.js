const Tought = require('../models/Tought')
const User = require('../models/User')

module.exports = class ToughtController {

    static async showToughts(req, res) {
        res.render('toughts/home')
    }

    static async dashboard(req, res) {
        const userId = req.session.userid

        const user = await User.findOne({ 
            where: { id: userId },
            include: Tought,
            plain: true
        })

        const toughts = user.Toughts.map((tought) => tought.dataValues)

        res.render('toughts/dashboard', { toughts })
    }

    static createTought(req, res) {
        res.render('toughts/create')
    }

    static async createToughtSave(req, res) {
        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        await Tought.create(tought)

        try {
            req.flash('message', 'Pensamento cadastrado com sucesso!')

            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log(error);
        }

    }

}