const moment = require("moment");

module.exports = {
    paymentBib: (bib, order, url) => {
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
                    .btn-bib {
                        display: flex;
                        margin: 0 auto;
                        height: 40px;
                        width: 200px;
                        background-color: #1964FF;
                        text-decoration: none;
                        color: white;
                        transform: skew(-12deg);
                        clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);
                    }
                </style>
            </head>
            <body>
                <div class="wrapper">
                    <img src=${bib.marathon.imageEmail} style="width: 100%;">
                    <div style="background-color: black; height: 56px; display: flex;">
                        <p style="color: aliceblue; margin: auto;">Mã đăng ký của bạn: ${order.registerId}</span>
                    </div>
                    <div>
                        <h1 style="text-align: center;">Xác nhận đăng kí thành công -  ${bib.marathon.name}</h1>
                        <p style="text-align: center;">
                            Xin chúc mừng ${bib.fullName}, <br />
                            Bạn đã đăng ký tham gia thành công Giải <b>${bib.marathon.name}</b>. <br />
                            Để xem và nhận được số BIB của bạn, mời bạn nhấn vào nút bên dưới để tiến hành quay và nhận số BIB.
                        </p>
                        <h1>Thông tin của bạn</h1>
                        <table style="width: 100%;">
                            <tr>
                                <td style="padding: 10px; display: inline-block;">Cự ly</td>
                                <th style="padding: 10px; display: block; float: right;">${bib.marathon.distance} ${bib.marathon.unit}</th>
                            </tr>
                            <tr>
                                <td style="padding: 10px; display: inline-block;">Họ và tên</td>
                                <th style="padding: 10px; display: block; float: right;">${bib.fullName}</th>
                            </tr>
                            <tr>
                                <td style="padding: 10px; display: inline-block;">Giới tính</td>
                                <th style="padding: 10px; display: block; float: right;">${bib.gender}</th>
                            </tr>
                            <tr>
                                <td style="padding: 10px; display: inline-block;">Ngày sinh</td>
                                <th style="padding: 10px; display: block; float: right;">${moment(bib.birthday).format("DD/MM/YYYY")}</th>
                            </tr>
                            <tr>
                                <td style="padding: 10px; display: inline-block;">Số điện thoại</td>
                                <th style="padding: 10px; display: block; float: right;">${bib.phone}</th>
                            </tr>
                            <tr>
                                <td style="padding: 10px; display: inline-block;">Email</td>
                                <th style="padding: 10px; display: block; float: right;">${bib.email}</th>
                            </tr>
                            <tr>
                                <td style="padding: 10px; display: inline-block;">CMT/CCCD/Hộ chiếu</td>
                                <th style="padding: 10px; display: block; float: right;">${bib.passport}</th>
                            </tr>
                            <tr>
                                <td style="padding: 10px; display: inline-block;">Size áo</td>
                                <th style="padding: 10px; display: block; float: right;">${bib.shirtSize}</th>
                            </tr>
                        </table>
                    </div>
                    <div style="background-color: #FFF9E7; height: 200px; width: 100%; padding: 10px;">
                        <div style="margin: auto 0;">
                            <h1>Chi tiết hoá đơn</h1>
                            <table style="width:100%">
                                <tr>
                                    <td>
                                        <b>Hạng mục</b>
                                    </td>
                                    <td>
                                        <b>Số lượng</b>
                                    </td>
                                    <td style="float: right;">
                                        <b>Đơn giá</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Vé ${bib.marathon.state} - Cự ly ${bib.marathon.distance} ${bib.marathon.unit}</td>
                                    <td>x1</td>
                                    <td style="float: right;">${bib.marathon.price}đ</td>
                                </tr>
                            </table>
                            <table style="width:100%; margin-top: 20px;">
                                <tr>
                                    <td>Thành tiền</td>
                                    <th style="float: right;">${order.total}đ</th>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div>
                        <h1>Quy định và thể lệ:</h1>
                        <p>
                            Mọi thắc mắc về quy định hoàn trả vé bạn truy cập tại đây.<br>
                            Hãy liên hệ chúng tôi qua Website <a href="https://onewaymarathon.com/contact">onewaymarathon.com/contact</a> hoặc Hotline 08 1800 7898 <a href="https://onewaymarathon.com">Tại đây</a> để được lắng nghe và hỗ trợ nhanh nhất.
                        </p>
                    </div>
                </div>
            </body>
        </html>
            `
        )
    }
}