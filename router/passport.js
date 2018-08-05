module.exports = (express) => {
    let route = express.Router()
    let User = require('../model/User')

    route.post('/login', (req,res)=>{
        console.log('req.body',req.body)
        const param = req.body
        User.find({userId: param.userId}, (err, user)=>{
            if(!user || !user.length) User.insertMany([{
                    userId: param.userId,
                    password: param.userPw
                }])

            if(user.password != param.userPw) res.json({result: 'invalid password'});
            else res.json(user);
        })

    })

    // let passport = require('passport')
    // let LocalStrategy = require('passport-local').Strategy

    // passport.use(new LocalStrategy({
    //         usernameField: 'email',
    //         passwordField: 'passwd'
    //     },
    //     function (username, password, done) {
    //         User.findOne({ username: username }, function (err, user) {
    //             if (err) { return done(err); }
    //             if (!user) {
    //                 return done(null, false, { message: 'Incorrect username.' });
    //             }
    //             if (!user.validPassword(password)) {
    //                 return done(null, false, { message: 'Incorrect password.' });
    //             }
    //             return done(null, user);
    //         });
    //     }
    // ));


    // passport.serializeUser(function (user, done) {
    //     done(null, user)
    // });

    // passport.deserializeUser(function (user, done) {
    //     done(null, user);
    // });

    


    return route
}