const nodemailer = require('nodemailer')

// async..await is not allowed in global scope, must use a wrapper
function sendMail(target, text) {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "dummymamant@gmail.com", // generated ethereal user
            pass: "mamantmemangganteng" // generated ethereal password
        }
    });
    let email = `
    Hey there! Thank you for shopping with us :)
    Here are your purchase details:
    ${text}
    `

    let mailOptions = {
        from: 'Reyhan Huditama --- Cleatz CEO', // sender address
        to: target, // list of receivers
        subject: "Your Purchases", // Subject line
        text: email, // plain text body
        html: email // html body
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) console.log(err)
        else console.log('E-mail sent!')
    })
}

module.exports = sendMail