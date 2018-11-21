module.exports = (express) => {
    let route = express.Router()
    let User = require('../model/User')

    route.post('/login', (req,res)=>{
        console.log('req.body',req.body)
        const param = req.body
        User.find({userId: param.userId}, (err, users)=>{
            if(!users || !users.length) res.json({result: 'not exists'});
            else if(users[0].password != param.userPw) res.json({result: 'invalid password'});
            else res.json(users[0]);
        })

    })

    route.post('/sign', (req,res)=>{
        console.log('req.body',req.body)
        const param = req.body
        User.find({userId: param.userId}, (err, user)=>{
            let resultMsg = ''
            if(user && user.length) resultMsg = 'already exists'
            else{
                User.insertMany([{
                    userId: param.userId,
                    password: param.userPw
                }])
            }
            res.json({result: resultMsg});
        })

    })

    route.post('/updateMySongList', (req,res)=>{
        console.log('req.body',req.body)
        const param = req.body
        User.update(
            {userId: param.userId},
            {songList: param.songList},
            (err, raw) => {
                console.log('upate result', err, raw)
                if(!err){
                    User.find({userId: param.userId}, (err, users)=>{
                        if(!users || !users.length) res.json({result: 'not exists'});
                        else res.json({
                            songList: users[0].songList
                        });
                    })
                }else{
                    res.json({
                        err: err,
                        raw: raw
                    });
                }
            }
        )
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