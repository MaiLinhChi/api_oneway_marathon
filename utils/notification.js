const admin = require("firebase-admin");
const configJsonFirebase = require('./google-services.json');
const fcm = require('fcm-notification')

const certPath = admin.credential.cert(configJsonFirebase);
const FCM = new fcm(certPath);

const sendPushNotification = (deviceTokens, data) => {
    try{
        const message = {
            // data: {
            //     title: data.Title,
            //     body:  data.Decription,
            //     image: data.image,
            //     LinkUrl: data.launchUrl
            // },
            notification: {
                title: data.Title,
                body:  data.Description,
                image: data.image,
                // click_action: 'https://stackoverflow.com/questions/65377912/pushing-notification-to-all-users-in-firebase'
                // LinkUrl: data.launchUrl
            },
            // token: deviceTokens,
        };

        FCM.sendToMultipleToken(message, deviceTokens,(err, resp) => {
            if(err){
                throw err;
            }else{
                console.log('Successfully sent notification');
            }
        });

    }catch(err){
        throw err;
    }

}
const subcribeTopic = (deviceTokens, topic)=>{
    try{
        FCM.subscribeToTopic(deviceTokens, topic,(error, res)=>{
            if(error){
                console.log('Error subscribing to topic:', error);
            }else{
                console.log('Successfully subcribe topic', topic);
            }
        })
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
}
const sendToTopic = (topics,data)=>{
    const message = {
        // data: {
        //     LinkUrl: data.launchUrl
        // },
        notification: {
            title: data.Title,
            body:  data.Description,
            image: data.image,
            // click_action: 'https://stackoverflow.com/questions/65377912/pushing-notification-to-all-users-in-firebase'
            // LinkUrl: data.launchUrl
        },
    };
    try{
        FCM.sendToMultipleTopic(message, topics,(error, resp) => {
            if(error){
                console.log('Error subscribing to topic:', error);
            }else{
                console.log('Successfully sent notification topic');
            }
        });
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
}
// const token = 'dh0myt5rStixi_ImqozhOJ:APA91bGa2t0UwtrGHbSjL2v2jf-ewV8ky42ucuRq_L6MwbXbbe8qN2ka-yx2wPsEY8mMWA_PyZFtbpArdtyzvaB6h2P6MakWrb6P2pVAMcVpgXyan5KQxnV4BuKS7D9XeEPjr4n02zjI'
// sendPushNotification(token, 'Shopdi')
const token = ['dUB_1UdYRzqtbInioz69Qi:APA91bFPxkFUhE1Xi6PWzFHHjxpJomkB-bXU7XwgaifSQPAguWOwNCO9F7MhDRaTXsqHIBLg13WsYoCsWFB387Vvj-banDOSV-RdjE17dAy0AjUteWCYpJJuj9F6Z25LMwFzm_t5Ra60']

// subcribeTopic(token, 'abc')
// sendToTopic('abc')
module.exports = {sendPushNotification, sendToTopic, subcribeTopic}