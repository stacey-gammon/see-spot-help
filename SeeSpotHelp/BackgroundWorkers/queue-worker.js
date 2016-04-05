var Queue = require('firebase-queue'),
    Firebase = require('firebase');

var nodemailer = require('nodemailer');
var sendgrid = require('sendgrid')('theshelterhelper', 'alm0stfamous');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://stacey%40theshelterhelper.com:alm0stfamous@smtp.gmail.com');

var firebaseUrl = 'https://shining-torch-1432.firebaseio.com';

var queueRef = new Firebase(firebaseUrl + '/emails');

var htmlMessageCode = '' +
'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' +
'<html xmlns="http://www.w3.org/1999/xhtml">' +
 '<head>' +
 ' <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
 ' <title>The Shelter Helper</title>' +
 ' <meta name="viewport" content="width=device-width, initial-scale=1.0"/>' +
'</head>' +
' <body style="font-family: Arial;color:#495864">' +
' <table cellpadding="0" cellspacing="0" width="100%">' +
'  <tr>' +
'	<td align="center" bgcolor="#F5FAFA" style="padding: 40px 0 30px 0;">' +
'	 <img src="https://theshelterhelper.com/images/logo.png"' +
'		 alt="The Shelter Helper" width="300" style="display: block;" />' +
'	</td>' +
'</tr>' +
'	<tr>' +
'   <td style="padding: 60px;">' +
'		%%MESSAGE_HERE%%' +
'   </td>' +
'   </tr>' +
'   <tr>' +
'   <td style="padding: 30px; color: #B7AFA3; background-color: #F5FAFA; font-size:10px; text-align: center">' +
'		The Shelter Helper<br/>' +
'		<a href="mailto:info@theshelterhelper.com" target="_blank">info@theshelterhelper.com</a> |' +
'	   <a href="https://theshelterhelper.com/#/userSettingsPage">Manage your email preferences</a>' +
'   </td>' +
'  </tr>' +
' </table>' +
'</body> ' +
'</html>';


function GetFirebaseData(path, onSuccess) {
	console.log('GetFirebaseData');
	var ref = new Firebase(this.firebaseURL + "/" + path);

	ref.once("value", function (snapshot) {
		console.log('read succeeded with snapshot val ', snapshot.val());
		onSuccess(snapshot.val());
	}, function (errorObject) {
		console.log("Read failed: ", errorObject);
	});
};


function GetAdminEmail(adminId, onSuccess) {
	var myOnSuccess = function (data) {
		if (data) {
			onSuccess(data.email);
		} else {
			console.log('GetAdminEmail: data is null :(');
		}
	};
	console.log('Getting firebase data for adminId: ' + adminId);
	return GetFirebaseData(firebaseUrl + '/users/' + adminId, myOnSuccess);
};

function SendMemberRequestPendingEmail(adminEmail) {
	console.log('Sending new member pending email to ' + adminEmail);

	var mailOptions = {
	    from: 'stacey@theshelterhelper.com', // sender address
		fromname: 'The Shelter Helper',
	    to: adminEmail, // list of receivers
	    subject: 'Member requests pending at The Shelter Helper', // Subject line
	    text: 'A new member request is pending for your volunteer group at The Shelter Helper.  ' +
			' Go to http://theshelterhelper.com/ and view the Members tab on your group to approve or deny.', // plaintext body
	    html: htmlMessageCode.replace('%%MESSAGE_HERE%%', 'A new member request is pending for your ' +
		' volunteer group at The Shelter Helper. Go to ' +
		'<a href="http://theshelterhelper.com/">The Shelter Helper</a> and view the Members ' +
		'tab on your group to approve or deny!') // html body
	};

	var email = new sendgrid.Email(mailOptions);
	email.setFilters({
		'clicktrack': {
			'settings': {
				'enable': 1
			}
		}
	});
	sendgrid.send(email, function(err, json){
		if(err) { return console.error(err); }
		console.log(json);
	});
}


function SendMemberRequestApprovedEmail(email, groupName) {
	console.log('Sending member request approved email to ' + email);

	var mailOptions = {
	    from: 'stacey@theshelterhelper.com', // sender address
		fromname: 'The Shelter Helper',
	    to: email, // list of receivers
	    subject: 'Your request was approved', // Subject line
	    text: 'Your recent request to join a volunteer group at The Shelter Helper was approved. ' +
			' Go to http://theshelterhelper.com/ to view your new group!  Congrats!', // plaintext body
	    html: htmlMessageCode.replace('%%MESSAGE_HERE%%',
			'Your recent request to join the volunteer group ' + groupName + ' at The Shelter Helper was approved. ' +
			' Visit <a href="http://theshelterhelper.com/">The Shelter Helper</a> to view your new group. <br/><br/>' +
			'Congrats!') // html body
	};

	var email = new sendgrid.Email(mailOptions);
	email.setFilters({
		'clicktrack': {
			'settings': {
				'enable': 1
			}
		}
	});
	sendgrid.send(email, function(err, json){
		if(err) { return console.error(err); }
		console.log(json);
	});
}

function DoWork() {

	var queue = new Queue(queueRef, function(data, progress, resolve, reject) {

	  // Read and process task data
	  console.log('data = ', data);

		if (data.eventType && data.eventType == 'NEW_REQUEST_PENDING') {
			var onSuccess = function (email) {
				SendMemberRequestPendingEmail(email);
			};
			console.log('getting admin email');
			GetAdminEmail(data.adminId, onSuccess);
		} else if (data.eventType && data.eventType == 'REQUEST_APPROVED') {
			SendMemberRequestApprovedEmail(data.userEmail);
		}

	  // Do some work
	  progress(50);

	  // Finish the task asynchronously
	  setTimeout(function() {
	    resolve();
	  }, 1000);
	});
}

DoWork();
