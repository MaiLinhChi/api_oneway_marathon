

module.exports = {
    paymentBib: (order) => {
        return (
            `<div style="display: flex; flex-direction: column; align-items: center">
            <div style="max-width: 768px;">
                <img src="https://drive.google.com/uc?export=view&id=1Uj2MW6zHeTtsQ2xNfQDUq5L09Ow2JLei">
                <div style="background-color: black; height: 56px; display: flex;">
                    <p style="color: aliceblue; margin: auto;">Mã đăng ký của bạn: 028463528</span>
                </div>
                <div>
                    <h1>Xác nhận đăng kí thành công -  ${order.marathon}</h1>
                    <p>Xin chúc mừng ${order.fullName}, <br />Bạn đã đăng ký tham gia thành công Giải ${order.marathon}. <br />Để xem và nhận được số BIB của bạn, mời bạn nhấn vào nút bên dưới để tiến hành quay và nhận số BIB.</p>
                    <div style="display: flex; justify-content: center;">
                        <a href="" style="text-align: center; justify-content: center; display: flex; align-items: center; transform: skew(-12deg); background: #1964FF; width: 196px; height: 56px; color: #FFF9E7; text-decoration: none;">Quay BIB ngay</a>
                    </div>
                    <p style="text-align: center;">Hoặc ấn vào đây/sao chép đường dẫn này https://onewaymarathon.com/resetpassword?key=72aa06fc194acaefe808a00cb8576007 và dán lên trình duyệt của bạn để quay BIB.</p>
                    <table style="margin: 0 50px; width: 100%;">
                        <tr>
                            <tr style="padding: 10px; display: inline-block;">Cự ly</tr>
                            <tr style="padding: 10px; display: inline-block;">Họ và tên</tr>
                            <tr style="padding: 10px; display: inline-block;">Giới tính</tr>
                            <tr style="padding: 10px; display: inline-block;">Ngày sinh</tr>
                            <tr style="padding: 10px; display: inline-block;">Số điện thoại</tr>
                            <tr style="padding: 10px; display: inline-block;">Email</tr>
                            <tr style="padding: 10px; display: inline-block;">CMT/CCCD/Hộ chiếu</tr>
                            <tr style="padding: 10px; display: inline-block;">Size áo</tr>
                        </tr>
                        <tr>
                            <tr style="padding: 10px; display: inline-block;">${order.distance}M</tr>
                            <tr style="padding: 10px; display: inline-block;">${order.fullName}</tr>
                            <tr style="padding: 10px; display: inline-block;">${order.gender}</tr>
                            <tr style="padding: 10px; display: inline-block;">${order.birthday}</tr>
                            <tr style="padding: 10px; display: inline-block;">${order.phone}</tr>
                            <tr style="padding: 10px; display: inline-block;">${order.email}</tr>
                            <tr style="padding: 10px; display: inline-block;">${order.passport}</tr>
                            <tr style="padding: 10px; display: inline-block;">${order.shirtSize}</tr>
                        </tr>
                    </table>
                </div>
                <div style="background-color: #FFF9E7; height: 200px; padding: 30px; width: 100%;">
                    <p>Chi tiết hoá đơn</p>
                    <div style="display: flex; justify-content: space-between;">
                        <div>
                            <p>Hạng mục</p>
                            <p>Vé Early Birds - Cự ly ${order.distance}km</p>
                        </div>
                        <div>
                            <p>Số lượng</p>
                            <p>x1</p>
                        </div>
                        <div>
                            <p>Đơn giá</p>
                            <p>${order.price}đ</p>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <p>Thành tiền</p>
                        <p>${order.price}đ</p>
                    </div>
                </div>
                <div>
                    <p>Quy định và thể lệ:</span>
                    <p>
                        Mọi thắc mắc về quy định hoàn trả vé bạn truy cập tại đây.<br>
                        Hãy liên hệ chúng tôi qua Website onewaymarathon.com/contact hoặc Hotline 08 1800 7898<a>Tai day</a> để được lắng nghe và hỗ trợ nhanh nhất.
                    </p>
                </div>
            </div>
        </div>`
        )
    }
}