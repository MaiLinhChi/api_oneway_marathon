module.exports = {
    sendEmailCreateGroup: (group, url) => {
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
                            .btn-manager {
                                margin-left: auto;
                                height: auto;
                                background: #00AF89;
                                text-decoration: none;
                                color: white;
                                outline: none;
                                border: none;
                                cursor: pointer;
                                padding: 12px 30px;
                                font-weight: 600;
                                text-decoration: none;
                                color: white;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="wrapper">
                            <img src="https://drive.google.com/uc?export=view&id=1Uj2MW6zHeTtsQ2xNfQDUq5L09Ow2JLei" style="width: 100%; max-width: 768px;">
                            <div class="wrapper-top">
                                <h1>Tạo nhóm thành công - OneWay Marathon</h1>
                                <p class="font-size">
                                    Xin chào ${group.membership[0].fullName}, <br />
                                    Bạn đã khởi tạo nhóm ${group.groupName} tại giải ${group.marathonName}. Link gửi cho các thành viên <br />
                                    khác để cùng đăng ký bạn nhé!
                                </p>
                            </div>
                            <div class="wrapper-bottom">
                                <h2>Tên nhóm: Only tiger</h1>
                                <table style="width:100%" class="font-size">
                                    <tr>
                                        <td>Họ và tên trưởng nhóm</td>
                                        <td><strong>${group.membership[0].fullName}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Số điện thoại</td>
                                        <td><strong>${group.membership[0].phone}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Email</td>
                                        <td><strong>${group.membership[0].email}</strong></td>
                                    </tr>
                                </table>
                                <h2>Link đăng ký nhóm</h1>
                                <div class="link-group font-size">
                                    <p class="text">${group.linkJoin}</p>
                                    <button class="btn-copy" onclick="copyText(${group.linkJoin})">Sao chép</button>
                                </div>
                                <div class="instruct font-size">
                                    <p>Hướng dẫn: Để đăng ký theo nhóm (từ 2 người) bạn cần làm theo các bước sau:</p>
                                    <ul style="padding-left: 20px;">
                                        <li>Bước 1: Chia sẻ “link đăng ký nhóm” bên trên cho bạn bè.</li>
                                        <li>Bước 2: Các vận động viên truy cập link và điền thông tin cần thiết.</li>
                                        <li>Bước 3: Trưởng nhóm hoàn tất đăng ký và tiến hành thanh toán.</li>
                                    </ul>
                                </div>
                            </div>
                            <div style="text-align: center; margin-top: 14px;">
                                <a class="btn-manager" href=${url}/group/${group.marathonId}>Quản lý nhóm</a>
                            </div>
                        </div>
                    </body>
                </html>
                
                <script>
                    const copyText = (text) => {
                        const el = document.createElement('textarea');
                        el.value = text;
                        document.body.appendChild(el);
                        el.select();
                        document.execCommand('copy');
                        document.body.removeChild(el);
                    };
                </script>
            `
        )
    }
}