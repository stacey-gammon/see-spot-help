var Queue = require('firebase-queue'),
    Firebase = require('firebase');

var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://stacey%40theshelterhelper.com:alm0stfamous@smtp.gmail.com');

var firebaseUrl = 'https://shining-torch-1432.firebaseio.com';

var queueRef = new Firebase(firebaseUrl + '/emails');


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
	    to: adminEmail, // list of receivers
	    subject: 'Member requests pending at The Shelter Helper', // Subject line
	    text: 'A new member request is pending for your volunteer group at The Shelter Helper.  ' +
			' Go to http://theshelterhelper.com/ and view the Members tab on your group to approve or deny.', // plaintext body
	    html: 'A new member request is pending for your volunteer group at The Shelter Helper. ' +
			' Go to <a href="http://theshelterhelper.com/">The Shelter Helper</a> and view the Members ' +
			'tab on your group to approve or deny.' // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});
}


function SendMemberRequestApprovedEmail(email, groupName) {
	console.log('Sending member request approved email to ' + email);

	var mailOptions = {
	    from: 'stacey@theshelterhelper.com', // sender address
	    to: email, // list of receivers
	    subject: 'Your request to join a volunteer group was approved', // Subject line
	    text: 'Your recent request to join a volunteer group at The Shelter Helper was approved. ' +
			' Go to http://theshelterhelper.com/ to view your new group!  Congrats!', // plaintext body
	    html: 'Your recent request to join the volunteer group ' + groupName + ' at The Shelter Helper was approved. ' +
			' Visit <a href="http://theshelterhelper.com/">The Shelter Helper</a> to view your new group. ' +
			'Congrats!' // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
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
