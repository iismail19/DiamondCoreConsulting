const http = require('http');
const express = require('express');
const bodyparser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');

var app = express();

port = process.env.PORT || 100;

app.use(bodyparser.urlencoded({
    extended: false
}));
app.use(bodyparser.json());


var htmlFile;
// var cssFile;

fs.readFile('./thankyou.html', function (err, data) {
    if (err) {
        throw err;
    }
    htmlFile = data;
});


const server = http.createServer((request, response) => {
    // Server Logic goes here

    const {
        headers,
        method,
        url
    } = request; // The request object is an instance of IncomingMessage
    let body = []; // Create an array for incoming string
    var dataType = [];

    //Request
    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        // At this point, we have the full url with headers, method, body
        // we can do as we like with the request
        dataType = body.split('&');
        for (var i = 0; i < dataType.length; i++) {
            dataType[i] = dataType[i].replace('=', ' ').toString();
        }

        let transporter = nodemailer.createTransport({
            host: "mail.privateemail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'info@diamondcoreconsulting.com', // generated ethereal user
                pass: '' // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // send mail with defined transport object
        let HelperOptions = ({
            from: 'info@diamondcoreconsulting.com', // sender address
            to: 'info@diamondcoreconsulting.com', // list of receivers
            subject: "Online Form", // Subject line
            text: dataType.toString() // plain text body

        });

        transporter.sendMail(HelperOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        console.log(dataType.toString());

        // Response
        response.on('error', (err) => {
            console.error(err);
        });

        // response.statusCode = 200;
        // response.setHeader('Content-Type', 'application/json');
        // // Note: the 2 lines above could be replaced with this next one:
        // // response.writeHead(200, {'Content-Type': 'application/json'})

        // const responseBody = { headers, method, url, body };

        // response.write(JSON.stringify(responseBody));
        // response.write("Message Received");
        // response.end();

        // Note: the 2 lines above could be replaced with this next one:
        // response.end(JSON.stringify(responseBody))

        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        response.write(htmlFile);
        response.end();

    });
}).listen(port, () => console.log('Server started... ' + port)); // Activates our servers on port 8080
