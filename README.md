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

### 3. Cài đặt MetaMask và lấy Sepolia ETH

#### Bước 1: Cài đặt MetaMask
1. Truy cập [metamask.io](https://metamask.io/)
2. Click "Download" và chọn trình duyệt của bạn (Chrome/Firefox/Edge)
3. Cài extension và làm theo hướng dẫn tạo ví
4. **LƯU KỸ SECRET RECOVERY PHRASE!** (12 từ)

#### Bước 2: Thêm Sepolia Testnet
1. Mở MetaMask, click vào network dropdown (góc trên trái)
2. Bật "Show test networks" trong Settings > Advanced
3. Chọn "Sepolia" từ danh sách networks
4. Xác nhận đã chuyển sang Sepolia (màu xanh lá)

#### Bước 3: Lấy Sepolia ETH miễn phí
Bạn cần ETH để trả gas fees. Sử dụng các faucets sau:

**Faucet 1: Alchemy Sepolia Faucet** (Khuyên dùng)
- Link: [sepoliafaucet.com](https://sepoliafaucet.com/)
- Đăng nhập bằng Alchemy account (miễn phí)
- Nhập địa chỉ ví MetaMask
- Nhận 0.5 SepoliaETH/ngày

**Faucet 2: QuickNode Faucet**
- Link: [faucet.quicknode.com/ethereum/sepolia](https://faucet.quicknode.com/ethereum/sepolia)
- Paste địa chỉ ví và nhận 0.1 ETH

**Faucet 3: Infura Sepolia Faucet**
- Link: [infura.io/faucet/sepolia](https://www.infura.io/faucet/sepolia)
- Đăng nhập và claim 0.5 ETH/day

> 💡 **Lưu ý:** Nếu faucet không hoạt động, thử faucet khác hoặc đợi 24h để claim lại.

### 4. Deploy Smart Contract với Remix

#### Bước 1: Mở Remix IDE
1. Truy cập [remix.ethereum.org](https://remix.ethereum.org/)
2. Đợi IDE load xong

#### Bước 2: Copy Smart Contract
1. Trong Remix, click **File Explorer** (icon folder bên trái)
2. Tạo file mới: `contracts/TaskManager.sol`
3. Copy toàn bộ code từ file `contracts/TaskManager.sol` trong project này
4. Paste vào Remix editor

#### Bước 3: Compile Contract
1. Click tab **Solidity Compiler** (icon chữ S)
2. Chọn compiler version: `0.8.19` hoặc cao hơn
3. Click nút **Compile TaskManager.sol**
4. Đợi compile thành công (màu xanh lá)

#### Bước 4: Deploy lên Sepolia
1. Click tab **Deploy & Run Transactions** (icon Ethereum)
2. **Environment:** Chọn **"Injected Provider - MetaMask"**
3. MetaMask popup → Chọn account và click **Connect**
4. Xác nhận network là **Sepolia** (màu cam/xanh)
5. **Contract:** Chọn **TaskManager**
6. Click nút **Deploy** (màu cam)
7. MetaMask popup:
   - Kiểm tra gas fee (thường ~0.002 - 0.005 ETH)
   - Click **Confirm**
8. Đợi transaction được confirm (10-30 giây)

#### Bước 5: Lấy Contract Address
1. Sau khi deploy thành công, xem phần **Deployed Contracts** bên dưới
2. Click vào contract name để expand
3. Copy địa chỉ contract (dạng `0x123...abc`)
4. **LƯU LẠI ĐỊA CHỈ NÀY!** Bạn sẽ cần nó ở bước tiếp theo

#### Optional: Verify Contract trên Etherscan
1. Truy cập [sepolia.etherscan.io](https://sepolia.etherscan.io/)
2. Paste contract address vào ô search
3. Click tab **Contract** > **Verify and Publish**
4. Làm theo hướng dẫn để verify source code

### 5. Cấu hình môi trường (.env)

Tạo file `.env` trong thư mục root của project:

```env
# Contract Address từ Remix (Bước 4.5)
VITE_CONTRACT_ADDRESS=0x... # Thay bằng địa chỉ contract của bạn

# Chain ID (Sepolia)
VITE_CHAIN_ID=11155111
```

**Ví dụ:**
```env
VITE_CONTRACT_ADDRESS=0xd9145CCE52D386f254917e481eB44e9943F39138
VITE_CHAIN_ID=11155111
```

### 6. Chạy ứng dụng
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


## 🐛 Troubleshooting (Khắc phục sự cố)

### ❌ Lỗi MetaMask

**"MetaMask không popup khi kết nối?"**
1. Kiểm tra đã cài đặt MetaMask extension chưa
2. Refresh trang (F5) và thử lại
3. Mở console (F12) và kiểm tra lỗi
4. Xóa cache và cookies của trang
5. Thử trình duyệt khác

**"Không thấy Sepolia network trong MetaMask?"**
1. Mở MetaMask → Settings → Advanced
2. Bật "Show test networks"
3. Quay lại network dropdown và chọn Sepolia

**"MetaMask bị khóa (locked)?"**
1. Click vào icon MetaMask
2. Nhập password để unlock
3. Refresh trang web

### ❌ Lỗi Transaction

**"Transaction failed / reverted?"**
- **Nguyên nhân 1:** Không đủ ETH để trả gas fee
  - **Giải pháp:** Lấy thêm ETH từ faucet
- **Nguyên nhân 2:** Gas limit quá thấp
  - **Giải pháp:** Trong MetaMask popup, click "Edit" > "Advanced" > Tăng Gas Limit
- **Nguyên nhân 3:** Contract logic error (ví dụ: xóa task không phải của bạn)
  - **Giải pháp:** Kiểm tra lại quyền owner hoặc logic contract

**"Transaction pending quá lâu?"**
1. Đợi thêm 1-2 phút (Sepolia đôi khi chậm)
2. Kiểm tra trên [Sepolia Etherscan](https://sepolia.etherscan.io/)
3. Nếu stuck, có thể "Speed Up" trong MetaMask
4. Hoặc "Cancel" transaction và thử lại

**"Nonce too low / Nonce too high?"**
1. MetaMask → Settings → Advanced → "Clear activity tab data"
2. Hoặc "Reset Account" (không mất ETH, chỉ reset transaction history)

### ❌ Lỗi Contract

**"Contract không hoạt động / Tasks không hiển thị?"**
1. **Kiểm tra `.env`**: Đảm bảo `VITE_CONTRACT_ADDRESS` đúng
2. **Kiểm tra network**: MetaMask phải ở Sepolia
3. **Xác minh contract**: Truy cập `https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS`
   - Phải thấy contract code và transactions
4. **Clear cache**: Ctrl+Shift+Delete > Clear All
5. **Redeploy contract**: Nếu contract bị lỗi, deploy lại từ Remix

**"Contract ABI error?"**
1. Đảm bảo contract version trong code khớp với deployed contract
2. Nếu đã sửa contract, phải redeploy
3. Kiểm tra file `src/modules/common/utils/constants.js` có đúng ABI không

**"Blank page / White screen?"**
1. Mở Console (F12) và xem lỗi
2. Thường là do thiếu `.env` hoặc contract address sai
3. Kiểm tra `npm run dev` có lỗi gì không

### ❌ Lỗi Faucet

**"Faucet không gửi ETH?"**
- Thử faucet khác (có 3 faucets ở Bước 3.3)
- Một số faucet yêu cầu Twitter/GitHub account
- Đợi 24h và thử lại
- Join Discord communities để xin testnet ETH

### ❌ Lỗi Build/Development

**"Module not found / Cannot find module?"**
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

**"Port 5173 already in use?"**
```bash
# Kill process đang dùng port
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5173 | xargs kill -9
```

---

## 🌟 Điểm Nổi Bật (Project Highlights)

### 🎨 Outstanding UI/UX
- **Premium Glassmorphism Theme** - Hiệu ứng kính mờ cao cấp
- **Terminal Aesthetic** - Giao diện developer-friendly
- **Dark Mode** - Bảo vệ mắt, hiện đại
- **Responsive Design** - Hoàn hảo trên mọi thiết bị
- **Real-time Countdown** - Đếm ngược deadline theo giây

### 📊 Advanced Dashboard
- **3 Interactive Charts** (Recharts):
  - ETH Earnings Line Chart
  - Completion Trend Area Chart
  - Priority Distribution Donut Chart (clickable!)
- **Time Range Selector** - Filter theo thời gian
- **Activity Terminal** - Real-time blockchain events
- **Quick Actions FAB** - Tạo task nhanh
- **Empty State Onboarding** - Hướng dẫn người dùng mới

### 🔥 Premium Features
- **Wallet Identicons** - Avatar độc đáo cho mỗi ví
- **Task Detail Modal** - Xem chi tiết với glassmorphism
- **Advanced Filtering** - Status, Priority, Category
- **Search & Sort** - Tìm kiếm thông minh
- **Trend Indicators** - So sánh hiệu suất

### ⚙️ Technical Excellence
- **Modular Architecture** - Code dễ bảo trì
- **Context API** - State management hiệu quả
- **Optimistic Updates** - UX mượt mà
- **Error Handling** - Rollback khi transaction fail
- **Custom Hooks** - Reusable logic

---

## 📚 Tài liệu tham khảo

- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethers.js v6 Docs](https://docs.ethers.org/v6/)
- [MetaMask Developer Docs](https://docs.metamask.io/)
- [Remix IDE Tutorial](https://remix-ide.readthedocs.io/)
- [Sepolia Testnet Info](https://sepolia.dev/)

---

---