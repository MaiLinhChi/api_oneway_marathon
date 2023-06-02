const moment = require("moment");

const sendEmailRemoveMember =  (group, member, leader) => {
    return (
        `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    .wrapper {
                        max-width: 768px;
                        margin: 0 auto;
                        color: black;
                    }
                    .wrapper-top {
                        padding: 20px 20px 0 20px;
                    }
                    .wrapper-bottom {
                        padding: 20px;
                        background: #F9FBFB;
                    }
                    .wrapper-info {
                        padding: 20px;
                    }
                    .link-group {
                        background: #E6EBF0;
                        display: flex;
                        margin-bottom: 4px;
                        width: 100%;
                        max-width: 100%;
                    }
                    .text {
                        margin: 0;
                        padding: 10px 20px;
                        color: #1964FF;
                    }
                    .font-size {
                        font-size: 14px;
                        line-height: 20px;
                    }
                    .instruct {
                        background: #E6EBF0;
                        padding: 20px;
                        max-width: 100%;
                    }
                    .btn-copy {
                        margin-left: auto;
                        height: auto;
                        width: 100px;
                        background-color: #1964FF;
                        text-decoration: none;
                        color: white;
                        outline: none;
                        border: none;
                        cursor: pointer;
                    }
                </style>
            </head>
            <body>
                <div class="wrapper">
                    <img src="https://drive.google.com/uc?export=view&id=1Uj2MW6zHeTtsQ2xNfQDUq5L09Ow2JLei" style="width: 100%; max-width: 768px;">
                    <div class="wrapper-top">
                        <h1>Thông báo nhóm ${group.groupName} đã bị xóa<h1>
                        <p class="font-size">
                            Xin chào ${member.fullName}, <br />
                            Nhóm của bạn vừa được xóa bỏi trưởng nhóm ${group.groupName}
                        </p>
                    </div>
                    <div class="wrapper-bottom">
                        <h2>Tên nhóm: ${group.groupName}</h1>
                        <table style="width:100%" class="font-size">
                            <tr>
                                <td>Họ và tên trưởng nhóm</td>
                                <td><strong>${leader.fullName}</strong></td>
                            </tr>
                            <tr>
                                <td>Số điện thoại</td>
                                <td><strong>${leader.phone}</strong></td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td><strong>${leader.email}</strong></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </body>
        </html>
        `
    )
}
module.exports = sendEmailRemoveMember