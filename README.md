<p align="center">
    <img src="doc/image/logo.png" width="80px" />
    <h1 align="center">Cloud Mail</h1>
    <p align="center">Dịch vụ email đơn giản, responsive dựa trên Cloudflare, hỗ trợ gửi email và gửi/nhận tệp đính kèm 🎉</p> 
    <p align="center">
        Tiếng Việt | <a href="/README-en.md" style="margin-left: 5px">English </a>
    </p>
    <p align="center">
        <a href="https://github.com/minhduc290613/cloud-mail/tree/main?tab=MIT-1-ov-file" target="_blank" >
            <img src="https://img.shields.io/badge/license-MIT-green" />
        </a>    
        <a href="https://github.com/minhduc290613/cloud-mail/releases" target="_blank" >
            <img src="https://img.shields.io/github/v/release/minhduc290613/cloud-mail" alt="releases" />
        </a>  
        <a href="https://github.com/minhduc290613/cloud-mail/issues" >
            <img src="https://img.shields.io/github/issues/minhduc290613/cloud-mail" alt="issues" />
        </a>  
        <a href="https://github.com/minhduc290613/cloud-mail/stargazers" target="_blank">
            <img src="https://img.shields.io/github/stars/minhduc290613/cloud-mail" alt="stargazers" />
        </a>  
        <a href="https://github.com/minhduc290613/cloud-mail/forks" target="_blank" >
            <img src="https://img.shields.io/github/forks/minhduc290613/cloud-mail" alt="forks" />
        </a>
    </p>
</p>

## Giới thiệu dự án

Chỉ cần một tên miền, người dùng có thể tạo nhiều địa chỉ email khác nhau, tương tự như các nền tảng email phổ biến.

Dự án hỗ trợ triển khai trên Cloudflare Workers, giúp giảm chi phí máy chủ và cho phép người dùng tự xây dựng dịch vụ email của riêng mình.

## Demo dự án

* [Demo trực tuyến](https://mail.vandekn.qzz.io)<br>
* [Tài liệu triển khai](https://doc.mail.vandekn.qzz.io/)<br>

| ![](/doc/image/demo.png) | ![](/doc/image/demo2.png) |
| ------------------------ | ------------------------ |
| ![](/doc/image/demo3.png) | ![](/doc/image/demo4.png) |

## Các tính năng

* **💰 Chi phí sử dụng thấp**: Có thể triển khai trên Cloudflare Workers để giảm chi phí máy chủ.

* **💻 Thiết kế responsive**: Giao diện responsive tự động thích ứng với máy tính và hầu hết trình duyệt trên điện thoại.

* **📧 Gửi email**: Tích hợp Resend để gửi email, hỗ trợ gửi hàng loạt, gửi hình ảnh nhúng và tệp đính kèm, đồng thời có thể xem trạng thái gửi.

* **🛡️ Chức năng quản trị**: Có thể quản lý người dùng và email, sử dụng phân quyền RBAC để kiểm soát chức năng và giới hạn tài nguyên sử dụng.

* **📦 Gửi và nhận tệp đính kèm**: Hỗ trợ gửi/nhận tệp đính kèm, sử dụng R2 Object Storage để lưu trữ và tải xuống tệp.

* **🔔 Thông báo email**: Sau khi nhận email, hệ thống có thể chuyển tiếp thông báo đến bot Telegram hoặc email của các nhà cung cấp dịch vụ khác.

* **📡 API mở**: Hỗ trợ sử dụng API để tạo hàng loạt người dùng và tìm kiếm email theo nhiều điều kiện.

* **🔢 Nhận diện mã xác minh**: Sử dụng Workers AI để tự động nhận diện mã xác minh trong email.

* **📈 Trực quan hóa dữ liệu**: Sử dụng ECharts để trực quan hóa dữ liệu hệ thống và thống kê sự tăng trưởng của người dùng, email.

* **🎨 Tùy chỉnh giao diện**: Có thể tùy chỉnh tiêu đề website, hình nền đăng nhập và độ trong suốt.

* **🤖 Xác minh người dùng**: Tích hợp Turnstile để xác minh người dùng, ngăn chặn việc đăng ký hàng loạt tự động.

* **📜 Nhiều tính năng khác**: Đang được phát triển...

## Công nghệ sử dụng

* **Nền tảng**: [Cloudflare Workers](https://developers.cloudflare.com/workers/)

* **Framework Web**: [Hono](https://hono.dev/)

* **ORM**: [Drizzle](https://orm.drizzle.team/)

* **Framework Frontend**: [Vue3](https://vuejs.org/)

* **Framework UI**: [Element Plus](https://element-plus.org/)

* **Gửi email**: [Resend](https://resend.com/)

* **Bộ nhớ đệm**: [Cloudflare KV](https://developers.cloudflare.com/kv/)

* **Cơ sở dữ liệu**: [Cloudflare D1](https://developers.cloudflare.com/d1/)

* **Lưu trữ tệp**: [Cloudflare R2](https://developers.cloudflare.com/r2/)

## Cấu trúc thư mục

```text
cloud-mail
├── mail-worker				    # Dự án backend Worker
│   ├── src                  
│   │   ├── api	 			    # Tầng API
│   │   ├── const  			    # Hằng số của dự án
│   │   ├── dao                 # Tầng truy cập dữ liệu
│   │   ├── email			    # Xử lý và nhận email
│   │   ├── entity			    # Entity cơ sở dữ liệu
│   │   ├── error			    # Các ngoại lệ tùy chỉnh
│   │   ├── hono			    # Cấu hình framework Web, interceptor, xử lý ngoại lệ toàn cục...
│   │   ├── i18n			    # Quốc tế hóa / đa ngôn ngữ
│   │   ├── init			    # Khởi tạo bộ nhớ đệm và cơ sở dữ liệu
│   │   ├── model			    # Đóng gói dữ liệu phản hồi
│   │   ├── security			# Xác thực danh tính và phân quyền
│   │   ├── service			    # Tầng dịch vụ nghiệp vụ
│   │   ├── template			# Mẫu thông báo
│   │   ├── utils			    # Các tiện ích
│   │   └── index.js			# Tệp khởi chạy
│   ├── pageckge.json			# Các thư viện/phụ thuộc của dự án
│   └── wrangler.toml			# Cấu hình dự án
│
├── mail-vue				    # Dự án frontend Vue
│   ├── src
│   │   ├── axios 			    # Cấu hình Axios
│   │   ├── components			# Các component tùy chỉnh
│   │   ├── echarts			    # Import component ECharts
│   │   ├── i18n			    # Quốc tế hóa / đa ngôn ngữ
│   │   ├── init			    # Khởi tạo
│   │   ├── layout			    # Component bố cục chính
│   │   ├── perm			    # Xác thực và phân quyền
│   │   ├── request			    # API
│   │   ├── router			    # Cấu hình router
│   │   ├── store			    # Quản lý trạng thái toàn cục
│   │   ├── utils			    # Các tiện ích
│   │   ├── views			    # Các component giao diện
│   │   ├── app.vue			    # Component khởi chạy
│   │   ├── main.js			    # JavaScript khởi chạy
│   │   └── style.css			# CSS toàn cục
│   ├── package.json			# Các thư viện/phụ thuộc của dự án
└── └── env.release				# Cấu hình dự án
```
## Donate me
minhduc290613:
[![Donate Me](https://img.shields.io/badge/Donate-Me-ff69b4?style=for-the-badge&logo=githubsponsors&logoColor=white)](https://donate.protechvn.io.vn) <br/>
Maillab: [donate](https://doc.skymail.ink/en/support.html)


## Giấy phép

Dự án này được phát hành theo giấy phép [MIT](LICENSE).

## Thanks
This project is a remake based on the original development by maillab. I would like to thank maillab and the contributors who have contributed to this project.
Original repositories: [Repo](https://github.com/maillab/cloud-mail)

