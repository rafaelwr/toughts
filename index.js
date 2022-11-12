const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()

const conn = require('./db/conn')

// Models
const User = require('./models/User')
const Tought = require('./models/Tought')

// Import Controllers
const ToughtController = require('./controllers/ToughtController')
const AuthController = require('./controllers/AuthController')

// Import Routes
const toughtsRoutes = require('./routes/toughtsRoutes')
const authRoutes = require('./routes/authRoutes')

// Template Engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// Get response of body
app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())

// Session Middleware
app.use(
    session({
        name: 'session',
        secret: 'test_secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    })
)

// Flash Messages
app.use(flash())

// Public Path
app.use(express.static('public'))

// Set Session
app.use((req, res, next) => {
    if(req.session.userid) {
        res.locals.session = req.session
    }

    next()
})

// Routes
app.use('/toughts', toughtsRoutes)
app.use('/', authRoutes)

app.get('/', ToughtController.showToughts)

conn
    .sync()
    .then(() => app.listen(3000))
    .catch(error => console.log(error))