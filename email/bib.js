module.exports = {
    paymentBib: (order) => {
        return (
            `<div style="max-width: 768px;">
            <img src="https://drive.google.com/uc?export=view&id=1Uj2MW6zHeTtsQ2xNfQDUq5L09Ow2JLei" style="width: 100%;">
            <div style="background-color: black; height: 56px; display: flex;">
                <p style="color: aliceblue; margin: auto;">Mã đăng ký của bạn: 028463528</span>
            </div>
            <div>
                <h1 style="text-align: center;">Xác nhận đăng kí thành công -  ${order.marathon}</h1>
                <p style="text-align: center;">
                    Xin chúc mừng ${order.fullName}, <br />
                    Bạn đã đăng ký tham gia thành công Giải <b>${order.marathon}</b>. <br />
                    Để xem và nhận được số BIB của bạn, mời bạn nhấn vào nút bên dưới để tiến hành quay và nhận số BIB.
                </p>
                <a href="" style="transform: skew(-12deg); background: #1964FF; width: 196px; height: 56px; color: #FFF9E7; text-decoration: none; position: relative; display: block; margin: 0 auto;">
                    <span style="text-align: center;">Quay BIB ngay</span>
                </a>
                <p style="text-align: center;">Hoặc ấn vào đây/sao chép đường dẫn này https://onewaymarathon.com/resetpassword?key=72aa06fc194acaefe808a00cb8576007 và dán lên trình duyệt của bạn để quay BIB.</p>
                <h1>Thông tin của bạn</h1>
                <table style="width: 100%;">
                    <tr>
                        <td style="padding: 10px; display: inline-block;">Cự ly</td>
                        <th style="padding: 10px; display: block; float: right;">${order.distance}M</th>
                    </tr>
                    <tr>
                        <td style="padding: 10px; display: inline-block;">Họ và tên</td>
                        <th style="padding: 10px; display: block; float: right;">${order.fullName}</th>
                    </tr>
                    <tr>
                        <td style="padding: 10px; display: inline-block;">Giới tính</td>
                        <th style="padding: 10px; display: block; float: right;">${order.gender}</th>
                    </tr>
                    <tr>
                        <td style="padding: 10px; display: inline-block;">Ngày sinh</td>
                        <th style="padding: 10px; display: block; float: right;">${order.birthday}</th>
                    </tr>
                    <tr>
                        <td style="padding: 10px; display: inline-block;">Số điện thoại</td>
                        <th style="padding: 10px; display: block; float: right;">${order.phone}</th>
                    </tr>
                    <tr>
                        <td style="padding: 10px; display: inline-block;">Email</td>
                        <th style="padding: 10px; display: block; float: right;">${order.email}</th>
                    </tr>
                    <tr>
                        <td style="padding: 10px; display: inline-block;">CMT/CCCD/Hộ chiếu</td>
                        <th style="padding: 10px; display: block; float: right;">${order.passport}</th>
                    </tr>
                    <tr>
                        <td style="padding: 10px; display: inline-block;">Size áo</td>
                        <th style="padding: 10px; display: block; float: right;">${order.shirtSize}</th>
                    </tr>
                </table>
            </div>
            <div style="background-color: #FFF9E7; height: 200px; width: 100%;">
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
                            <td>Vé ${order.state} - Cự ly ${order.distance}km</td>
                            <td>x1</td>
                            <td style="float: right;">${order.price}đ</td>
                        </tr>
                    </table>
                    <table style="width:100%">
                        <tr>
                            <td>Thành tiền</td>
                            <th style="float: right;">${order.price}đ</th>
                        </tr>
                    </table>
                </div>
            </div>
            <div>
                <h1>Quy định và thể lệ:</h1>
                <p>
                    Mọi thắc mắc về quy định hoàn trả vé bạn truy cập tại đây.<br>
                    Hãy liên hệ chúng tôi qua Website <a href="https://onewaymarathon.com/contact">onewaymarathon.com/contact</a> hoặc Hotline 08 1800 7898<a href="https://onewaymarathon.com">Tại đây</a> để được lắng nghe và hỗ trợ nhanh nhất.
                </p>
            </div>
        </div>`
        )
    }
}