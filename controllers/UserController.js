const User = require('../models/User')
const Tought = require('../models/Tought')

module.exports = class UserController {

    static async userToughts(req, res) {
        const id = req.params.id

        const toughtsData = await Tought.findAll({ 
            where: { UserId: id },
            include: User
        })

        const userName = toughtsData[0].User.name

        const toughts = toughtsData.map((result) => result.get({ plain: true }))

        res.render('users/toughts', { toughts, userName })
    }

}