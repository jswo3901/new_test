var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// 유져 스키마정의
var userSchema = mongoose.Schema({

    local            : {

        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});


// 해쉬생성, 비밀번호를 위해서 즉 bcrypt는 해쉬생성 모듈 별 젖같은거 막나오져 지리져... 밑에는 읽어보고 맛가라고 올림
/*bcrypt
 bcrypt는 애초부터 패스워드 저장을 목적으로 설계되었다. Niels Provos와 David Mazières가 1999년 발표했고 현재까지 사용되는 가장 강력한 해시 메커니즘 중 하나이다. bcrypt는 보안에 집착하기로 유명한 OpenBSD에서 기본 암호 인증 메커니즘으로 사용되고 있고 미래에 PBKDF2보다 더 경쟁력이 있다고 여겨진다.
 bcrypt에서 "work factor" 인자는 하나의 해시 다이제스트를 생성하는 데 얼마만큼의 처리 과정을 수행할지 결정한다. "work factor"를 조정하는 것만으로 간단하게 시스템의 보안성을 높일 수 있다.
 다만 PBKDF2나 scrypt와는 달리 bcrypt는 입력 값으로 72 bytes character를 사용해야 하는 제약이 있다.
 */
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// 비밀번호가 유효하면
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


module.exports = mongoose.model('User', userSchema);