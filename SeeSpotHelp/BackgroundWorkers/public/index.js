var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://stacey%40theshelterhelper.com:alm0stfamous@smtp.gmail.com');


function SendEmail() {
	console.log('Attempting to send email');
	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: 'stacey@theshelterhelper.com', // sender address
	    to: 'stacey@staceygammon.om', // list of receivers
	    subject: 'Hello ✔', // Subject line
	    text: 'Hello world 🐴', // plaintext body
	    html: '<b>Hello world 🐴</b>' // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});
}

SendEmail();
