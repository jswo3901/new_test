var express = require('express'),
    app = express(),
    engine = require('ejs-locals'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    //로그인기능 위해 추가한 모듈
    flash = require('connect-flash'), // 에러메시지 띄우는 모듈 약간 더러움
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    session = require('express-session');







app.engine('ejs', engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(methodOverride("_method"));
//로그인위해 추가
app.use(cookieParser()); //인증위해서 필요한 쿠키 읽을 때 사용
//passport사용하기 위해서.
app.use(session({ secret : 'juuuuuuuuuuuus'})); //세션secret
app.use(passport.initialize());
app.use(passport.session()); // 지속적인 로그인위한 세션
app.use(flash()); //세션에 저장되는 flash메시지를 위해서 connect-flash사용한다.




require('./config/passport')(passport);
require('./app/routes.js')(app, passport);
//이거 두개 밑으로는 달라진거 없음.  passport랑 routes.js 두개 빼서 따로작성 추가함. config폴더랑 models폴더 만들었음.
// passport는 회원가입 로그인 구글,페북연동 등등 해주는 핵심 패키지
//config폴더는 poassport설정 파일 예를들면        이미 가입한 이메일 거른다거나, 처음가입하는 메일은 가입시켜주는 코드




//DB connect
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017');
var db = mongoose.connection;
db.once("open",function(){
    console.log("DB connected");
});
db.on("error", function(err){
    console.log("DB error : ", err);
});

//DB schema
var bbs  = mongoose.Schema({
    title:{type:String},
    content:{type:String}
});

var menubbs = mongoose.model("menubbs", bbs);



app.get('/', function(req, res){
    res.render('index');
});
app.get('/menu', function(req, res){
    menubbs.find({}, function(err, alldata){
        if(err) return res.json(err);
        res.render('list', {alldata:alldata});
    });
});
app.get('/new', function(req, res){
    res.render('new');
});
app.post("/new", function(req, res){
    menubbs.create(req.body, function(err){
        if(err) return res.json(err);
        res.redirect("/menu");
    });
});
app.get('/menu/:id', function(req, res){
    menubbs.findOne({_id:req.params.id}, function(err, onedata){
        if(err) return res.json(err);
        res.render("content", {onedata:onedata});
    });
});
app.get('/menu/edit/:id', function(req, res){
    menubbs.findOne({_id:req.params.id}, function(err, onedata){
        if(err) return res.json(err);
        res.render('edit', {onedata:onedata});
    });
});
app.put("/menu/:id", function(req, res){
    menubbs.findOneAndUpdate({_id:req.params.id}, req.body, function(err){
        if(err) return res.json(err);
        res.redirect("/menu/"+req.params.id);
    });
});
app.delete("/menu/:id", function(req, res){
    menubbs.remove({_id:req.params.id}, function(err){
        if(err) return res.json(err);
        res.redirect("/menu");
    });
});

// 에러페이지
app.use(function(req, res, next){
    res.status(404);
    res.render('errors/404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(505);
    res.render('errors/500');
});













//포트
app.listen(3000, function(){
    console.log('connected success!!');
});