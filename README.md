# 🎯 DApp Quản Lý Công Việc Phi Tập Trung

## 📖 Giới thiệu

Ứng dụng Web3 (DApp) cho phép người dùng quản lý công việc một cách phi tập trung trên blockchain Ethereum. Dữ liệu được lưu trữ hoàn toàn trên Smart Contract, đảm bảo tính minh bạch, bảo mật và không thể thay đổi.

## ✨ Tính năng chính

### 🔐 Quản lý ví
- ✅ Kết nối/Ngắt kết nối MetaMask
- ✅ Hiển thị địa chỉ ví và số dư ETH
- ✅ Tự động phát hiện và chuyển network (Sepolia Testnet)
- ✅ Lắng nghe thay đổi account/network

### 📝 Quản lý công việc
- ✅ Tạo công việc mới (tiêu đề, mô tả, deadline)
- ✅ Sửa công việc (chỉ owner)
- ✅ Xóa công việc (chỉ owner)
- ✅ Đánh dấu hoàn thành/chưa hoàn thành
- ✅ Gán công việc cho người khác
- ✅ Thêm tiền thưởng (ETH) cho công việc
- ✅ Nhận thưởng khi hoàn thành

### 🔍 Tìm kiếm & Lọc
- ✅ Tìm kiếm theo tiêu đề
- ✅ Lọc: Tất cả / Của tôi / Hoàn thành / Đang làm
- ✅ Sắp xếp: Mới nhất / Cũ nhất / Deadline

### 📊 Thống kê & Dashboard
- ✅ Tổng số công việc
- ✅ Số công việc hoàn thành
- ✅ Tỷ lệ hoàn thành
- ✅ Tổng thưởng đã nhận
- ✅ Biểu đồ trực quan
- ✅ Hoạt động gần đây

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications
- **React Icons** - Icons

### Web3
- **Ethers.js v6** - Ethereum library
- **MetaMask** - Wallet provider
- **Solidity** - Smart Contract language
- **Ethereum Sepolia** - Testnet

## 📋 Yêu cầu trước khi cài đặt

- Node.js >= 18.0.0
- npm hoặc yarn
- MetaMask extension
- ETH Sepolia testnet (lấy từ faucet)

## 🚀 Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd dapp-task-management
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình môi trường
Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Cập nhật các biến môi trường:
```env
VITE_CONTRACT_ADDRESS=0x... # Địa chỉ contract sau khi deploy
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

### 4. Chạy ứng dụng
```bash
npm run dev
```

Mở trình duyệt tại: `http://localhost:5173`

## 📁 Cấu trúc dự án

```
dapp-task-management/
├── src/
│   ├── modules/
│   │   ├── wallet/          # Module quản lý ví
│   │   ├── contract/        # Module tương tác contract
│   │   ├── task/            # Module quản lý công việc
│   │   ├── dashboard/       # Module thống kê
│   │   └── common/          # Components & utils dùng chung
│   ├── App.jsx
│   └── main.jsx
├── contracts/
│   └── TaskManager.sol      # Smart Contract
├── docs/                    # Documentation
└── README.md
```

## 🎮 Hướng dẫn sử dụng

### Bước 1: Kết nối ví
1. Click nút "Kết nối ví" ở góc trên phải
2. MetaMask sẽ popup, chọn account và confirm
3. Đảm bảo đang ở Sepolia network

### Bước 2: Tạo công việc
1. Click nút "Tạo công việc mới"
2. Nhập tiêu đề, mô tả, chọn deadline
3. Click "Lưu" và confirm transaction trên MetaMask
4. Đợi transaction được confirm

### Bước 3: Quản lý công việc
- **Sửa**: Click icon bút chì trên task card
- **Xóa**: Click icon thùng rác
- **Hoàn thành**: Click checkbox
- **Xem chi tiết**: Click vào task card

### Bước 4: Thêm thưởng
1. Mở chi tiết công việc
2. Nhập số ETH muốn thưởng
3. Confirm transaction
4. Người hoàn thành có thể claim thưởng

## 🔧 Scripts

```bash
npm run dev          # Chạy development server
npm run build        # Build production
npm run preview      # Preview production build
npm run lint         # Lint code
```


### Lỗi thường gặp:

**MetaMask không popup?**
- Kiểm tra đã cài MetaMask chưa
- Refresh trang và thử lại
- Check console log để xem lỗi

**Transaction failed?**
- Kiểm tra đủ ETH để trả gas fee
- Đảm bảo đang ở đúng network (Sepolia)
- Thử tăng gas limit

**Contract không hoạt động?**
- Kiểm tra địa chỉ contract trong `.env`
- Đảm bảo contract đã được deploy
- Verify contract trên Etherscan

⭐ Nếu project này hữu ích, hãy cho một star nhé!
