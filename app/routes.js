// app/routes.js
module.exports = function(app, passport) {



    // 로그인 라우팅 get,post
    app.get('/signin', function(req, res) {
        res.render('signin', { message: req.flash('loginMessage') }); //message객체에 플래쉬넣어서 템플릿으로  날려
    });
    //여기서 passport 강력함.
    app.post('/signin', passport.authenticate('local-login', {
        successRedirect : '/profile', // 로그인 성공하면 프로필url로
        failureRedirect : '/signin', // 실패하면 그대로
        failureFlash : true // 플래쉬 쓸려면 넣어야됨.
    }));

    //회원가입 라우팅 get,post
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // 회원가입도 로그인과 크게 다른점이 없음
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));



    // 로그인이 되었을때만 profile 볼 수 있어야한다. 그냥 url에 localhost:3000/profile치면 접속안됨 ->isLoggedIn함수
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // profile 템플릿으로 user객체 날림.
        });
    });


    // 로그아웃
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// 위에서 로그인 되었을때만 profile 볼 수 있게 해주는 함수 정의
function isLoggedIn(req, res, next) {

    //세션에서 유져가 인증되면
    if (req.isAuthenticated())
        return next();

    // 인증 안되면
    res.redirect('/');
}
