//passport로컬 사용
var LocalStrategy   = require('passport-local').Strategy;

// user모델 가져와
var User       		= require('../app/models/user');

//module.export사용 app.js에서 쓸거임 .. 이렇게->require('./config/passport')(passport);
module.exports = function(passport) {


    // \\\\\passport session  설정\\\\\
    // 사용자를 세션에서 시리얼라이즈, 언시리얼라이즈. 패스포트 사용법

    // 시리얼라이즈
    passport.serializeUser(function(user, done) {
        done(null, user.id); //위에서 user 모델 가져와서 user.id쓸수 있음
    });

    //언 시리얼라이즈
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    // \\\\\\SIGNUP\\\\\\ 이건 로컬이고 뒤에 구글,페이스북 등등 만들꺼임


    passport.use('local-signup', new LocalStrategy({


            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) { //여기서 쓰이는done은 패턴으로 그냥 보면됨 http://passportjs.org/docs/authenticate  <-passport Docs

            // 회원가입 할때 이미 이메일이 사용중인지 비교해서 사용중이면 빠꾸
            User.findOne({ 'local.email' :  email }, function(err, user) { // models/user.js 에서 만든 user모델 보면 객체이름이 local임 페이스북이면 Facebook
                if (err)
                    return done(err);

                //이메일 쓰고있다면?? flash를 통해 에러메시지.
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    //이메일 쓰고있는거 없으면 만들어줌.

                    var newUser            = new User();

                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password); // 비밀번호는 해쉬생성

                    // 새로 가입한 유져 저장
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }

            });

        }));

    
    // \\\\\\Login\\\\\\ 
    


    passport.use('local-login', new LocalStrategy({
           
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true 
        },
        function(req, email, password, done) { 

           
            User.findOne({ 'local.email' :  email }, function(err, user) {
                
                if (err)
                    return done(err);
              //유져가 없다면
                if (!user)
                    return done(null, false, req.flash('loginMessage', '아이디를 찾을 수 없습니다.')); 

                // 유져는 찾았는데 패스워드가 틀리면 
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', '비밀번호가 틀렸습니다.')); 

                // 유져도 있고 패스워드도 맞으면 리턴
                return done(null, user);
            });

        }));

};
