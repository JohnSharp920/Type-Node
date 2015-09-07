var User = require('../models/user.ts');

var config = require('../config');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {

    var token = jsonwebtoken.sign({
        _id: user._id,
        name: user.name,
        username: user.username
    }, secretKey, {
        expirtesInMinute: 1440
    });
    return token;

}

module.exports =  function(app, express) {

        var api = express.Router();


    api.post('/signup', function (req, res) {

        var user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        });

        user.save((err) => {
            if (err) {
                res.send(err);
                return;
            }
            res.json({ message: 'User has been created!' });
        });

        });

    api.get('/users', function(req, res) {
        User.find({}, function(err, users) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(users);
        });
        });

    api.post('/login', function(req, res) {

        User.findOne({
            username: req.body.username
        }).select('password').exec(function(err, user) {
            if (err) throw err;

            if (!user) {
                res.send({ message: "User doesnt exist" });
            }else if (user) {
                var validPassword = user.comparePassord(req.body.password);
                if (!validPassword) {
                    res.send({ message: "invalid Password" });
                } else {


                    //////token
                    var token = createToken(user);

                    res.json({
                        success: true,
                        message: "sucessful login",
                        token: token
                });


                }
            }
        });
    });

    //Middleware
    api.use(function(req, res, next) {
        console.log("Someone just entered our Website");
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];
        
        //check if token exists
        if (token) {
            jsonwebtoken.verify(token, secretKey, function(err, decoded) {
                if (err) res.status(403).send({ success: false, message: "Failed to authenticate user" });
                else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({success:false, message:"No Token Provided"});
        }
    });

    //Destination B // provide legitimate token
    api.get('/', function(req, res) {
        res.send("Hello World!");
    });


    return api;

}
