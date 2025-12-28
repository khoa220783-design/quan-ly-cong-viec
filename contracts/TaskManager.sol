// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title TaskManager
 * @dev Smart Contract quản lý công việc phi tập trung
 * @author Nguyễn Huy Điền
 */
contract TaskManager {
    
    // ============ STRUCTS ============
    
    /**
     * @dev Cấu trúc dữ liệu của một công việc
     */
    struct CongViec {
        uint256 id;                  // ID công việc
        address owner;               // Người tạo
        string tieuDe;               // Tiêu đề
        string moTa;                 // Mô tả chi tiết
        uint256 hanChot;             // Deadline (timestamp)
        bool daHoanThanh;            // Trạng thái hoàn thành
        uint256 tienThuong;          // Số tiền thưởng (wei)
        address nguoiDuocGan;        // Người được gán việc
        uint256 thoiGianTao;         // Thời gian tạo
        bool daNhanThuong;           // Đã nhận thưởng chưa
    }
    
    // ============ STATE VARIABLES ============
    
    uint256 private demCongViec;     // Đếm số lượng công việc
    mapping(uint256 => CongViec) public congViecs;  // Mapping ID -> CongViec
    
    // ============ EVENTS ============
    
    event CongViecDuocTao(
        uint256 indexed id,
        address indexed owner,
        string tieuDe,
        uint256 hanChot
    );
    
    event CongViecDuocSua(
        uint256 indexed id,
        string tieuDe,
        uint256 hanChot
    );
    
    event CongViecDuocXoa(
        uint256 indexed id,
        address indexed owner
    );
    
    event CongViecHoanThanh(
        uint256 indexed id,
        address indexed nguoiHoanThanh,
        bool trangThai
    );
    
    event CongViecDuocGan(
        uint256 indexed id,
        address indexed nguoiGan,
        address indexed nguoiNhan
    );
    
    event ThuongDuocThem(
        uint256 indexed id,
        address indexed nguoiThem,
        uint256 soTien
    );
    
    event ThuongDuocNhan(
        uint256 indexed id,
        address indexed nguoiNhan,
        uint256 soTien
    );
    
    // ============ MODIFIERS ============
    
    /**
     * @dev Chỉ owner của công việc mới được thực hiện
     */
    modifier chiOwner(uint256 _id) {
        require(congViecs[_id].owner == msg.sender, "Ban khong phai owner!");
        _;
    }
    
    /**
     * @dev Kiểm tra công việc có tồn tại không
     */
    modifier congViecTonTai(uint256 _id) {
        require(_id > 0 && _id <= demCongViec, "Cong viec khong ton tai!");
        _;
    }

    
    // ============ FUNCTIONS ============
    
    /**
     * @dev Tạo công việc mới
     * @param _tieuDe Tiêu đề công việc
     * @param _moTa Mô tả chi tiết
     * @param _hanChot Deadline (timestamp)
     */
    function taoCongViec(
        string memory _tieuDe,
        string memory _moTa,
        uint256 _hanChot
    ) public {
        require(bytes(_tieuDe).length > 0, "Tieu de khong duoc rong!");
        require(_hanChot > block.timestamp, "Han chot phai lon hon hien tai!");
        
        demCongViec++;
        
        congViecs[demCongViec] = CongViec({
            id: demCongViec,
            owner: msg.sender,
            tieuDe: _tieuDe,
            moTa: _moTa,
            hanChot: _hanChot,
            daHoanThanh: false,
            tienThuong: 0,
            nguoiDuocGan: address(0),
            thoiGianTao: block.timestamp,
            daNhanThuong: false
        });
        
        emit CongViecDuocTao(demCongViec, msg.sender, _tieuDe, _hanChot);
    }
    
    /**
     * @dev Sửa công việc (chỉ owner)
     * @param _id ID công việc
     * @param _tieuDe Tiêu đề mới
     * @param _moTa Mô tả mới
     * @param _hanChot Deadline mới
     */
    function suaCongViec(
        uint256 _id,
        string memory _tieuDe,
        string memory _moTa,
        uint256 _hanChot
    ) public congViecTonTai(_id) chiOwner(_id) {
        require(bytes(_tieuDe).length > 0, "Tieu de khong duoc rong!");
        require(_hanChot > block.timestamp, "Han chot phai lon hon hien tai!");
        
        CongViec storage cv = congViecs[_id];
        cv.tieuDe = _tieuDe;
        cv.moTa = _moTa;
        cv.hanChot = _hanChot;
        
        emit CongViecDuocSua(_id, _tieuDe, _hanChot);
    }
    
    /**
     * @dev Xóa công việc (chỉ owner)
     * @param _id ID công việc
     */
    function xoaCongViec(uint256 _id) 
        public 
        congViecTonTai(_id) 
        chiOwner(_id) 
    {
        // Nếu có tiền thưởng, hoàn lại cho owner
        if (congViecs[_id].tienThuong > 0 && !congViecs[_id].daNhanThuong) {
            (bool success, ) = payable(msg.sender).call{value: congViecs[_id].tienThuong}("");
            require(success, "Hoan tien that bai!");
        }
        
        delete congViecs[_id];
        emit CongViecDuocXoa(_id, msg.sender);
    }
    
    /**
     * @dev Đánh dấu hoàn thành/chưa hoàn thành
     * @param _id ID công việc
     * @param _trangThai true = hoàn thành, false = chưa hoàn thành
     */
    function danhDauHoanThanh(uint256 _id, bool _trangThai) 
        public 
        congViecTonTai(_id) 
    {
        CongViec storage cv = congViecs[_id];
        
        // Chỉ owner hoặc người được gán mới được đánh dấu
        require(
            msg.sender == cv.owner || msg.sender == cv.nguoiDuocGan,
            "Ban khong co quyen!"
        );
        
        cv.daHoanThanh = _trangThai;
        emit CongViecHoanThanh(_id, msg.sender, _trangThai);
    }
    
    /**
     * @dev Gán công việc cho người khác
     * @param _id ID công việc
     * @param _nguoiNhan Địa chỉ người nhận
     */
    function ganCongViec(uint256 _id, address _nguoiNhan) 
        public 
        congViecTonTai(_id) 
        chiOwner(_id) 
    {
        require(_nguoiNhan != address(0), "Dia chi khong hop le!");
        require(_nguoiNhan != msg.sender, "Khong the gan cho chinh minh!");
        
        congViecs[_id].nguoiDuocGan = _nguoiNhan;
        emit CongViecDuocGan(_id, msg.sender, _nguoiNhan);
    }
    
    /**
     * @dev Thêm tiền thưởng cho công việc
     * @param _id ID công việc
     */
    function themThuong(uint256 _id) 
        public 
        payable 
        congViecTonTai(_id) 
        chiOwner(_id) 
    {
        require(msg.value > 0, "So tien phai lon hon 0!");
        
        congViecs[_id].tienThuong += msg.value;
        emit ThuongDuocThem(_id, msg.sender, msg.value);
    }
    
    /**
     * @dev Nhận tiền thưởng (sau khi hoàn thành)
     * @param _id ID công việc
     */
    function nhanThuong(uint256 _id) public congViecTonTai(_id) {
        CongViec storage cv = congViecs[_id];
        
        require(cv.daHoanThanh, "Cong viec chua hoan thanh!");
        require(cv.tienThuong > 0, "Khong co tien thuong!");
        require(!cv.daNhanThuong, "Da nhan thuong roi!");
        
        // Người được gán hoặc owner có thể nhận
        require(
            msg.sender == cv.nguoiDuocGan || msg.sender == cv.owner,
            "Ban khong co quyen nhan thuong!"
        );
        
        uint256 soTien = cv.tienThuong;
        cv.daNhanThuong = true;
        cv.tienThuong = 0;
        
        (bool success, ) = payable(msg.sender).call{value: soTien}("");
        require(success, "Chuyen tien that bai!");
        
        emit ThuongDuocNhan(_id, msg.sender, soTien);
    }
    
    /**
     * @dev Lấy chi tiết một công việc
     * @param _id ID công việc
     * @return CongViec struct
     */
    function layChiTietCongViec(uint256 _id) 
        public 
        view 
        congViecTonTai(_id) 
        returns (CongViec memory) 
    {
        return congViecs[_id];
    }
    
    /**
     * @dev Lấy tất cả công việc
     * @return Mảng các công việc
     */
    function layTatCaCongViec() public view returns (CongViec[] memory) {
        CongViec[] memory result = new CongViec[](demCongViec);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= demCongViec; i++) {
            if (congViecs[i].id != 0) {  // Kiểm tra công việc chưa bị xóa
                result[index] = congViecs[i];
                index++;
            }
        }
        
        // Resize array nếu có công việc bị xóa
        if (index < demCongViec) {
            CongViec[] memory resized = new CongViec[](index);
            for (uint256 i = 0; i < index; i++) {
                resized[i] = result[i];
            }
            return resized;
        }
        
        return result;
    }
    
    /**
     * @dev Lấy công việc của một địa chỉ cụ thể
     * @param _owner Địa chỉ owner
     * @return Mảng các công việc
     */
    function layCongViecCuaToi(address _owner) 
        public 
        view 
        returns (CongViec[] memory) 
    {
        uint256 count = 0;
        
        // Đếm số lượng công việc của owner
        for (uint256 i = 1; i <= demCongViec; i++) {
            if (congViecs[i].owner == _owner && congViecs[i].id != 0) {
                count++;
            }
        }
        
        // Tạo mảng kết quả
        CongViec[] memory result = new CongViec[](count);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= demCongViec; i++) {
            if (congViecs[i].owner == _owner && congViecs[i].id != 0) {
                result[index] = congViecs[i];
                index++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Lấy công việc được gán cho một địa chỉ
     * @param _nguoi Địa chỉ người được gán
     * @return Mảng các công việc
     */
    function layCongViecDuocGan(address _nguoi) 
        public 
        view 
        returns (CongViec[] memory) 
    {
        uint256 count = 0;
        
        for (uint256 i = 1; i <= demCongViec; i++) {
            if (congViecs[i].nguoiDuocGan == _nguoi && congViecs[i].id != 0) {
                count++;
            }
        }
        
        CongViec[] memory result = new CongViec[](count);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= demCongViec; i++) {
            if (congViecs[i].nguoiDuocGan == _nguoi && congViecs[i].id != 0) {
                result[index] = congViecs[i];
                index++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Đếm tổng số công việc
     * @return Số lượng công việc
     */
    function demTongCongViec() public view returns (uint256) {
        return demCongViec;
    }
    
    /**
     * @dev Lấy balance của contract
     * @return Số dư contract (wei)
     */
    function layBalanceContract() public view returns (uint256) {
        return address(this).balance;
    }
}
