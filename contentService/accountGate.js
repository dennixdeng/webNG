var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("QQex",{
    auth: {
        user: "accountservice@shutm.com",
        pass: "account2service"
    }
});

var activeLink="http://www.shutm.com/account/activate/jisheng.deng@gmail.com/jkhrjhw342uy5235y7jkh";
// setup e-mail data with unicode symbols
var mailOptions = {
    from: "上海高校技术市场账号服务<accountservice@shutm.com>", // sender address
    to: "jisheng.deng@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world ✔", // plaintext body
    html: '<b>您好，<br>&nbsp;&nbsp;&nbsp;&nbsp;欢迎您注册上海高校技术市场账号，请点击以下链接以激活账号。 ✔</b><br><a href="'+activeLink+'">'+activeLink+'</a>' // html body
}

// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }

    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
});