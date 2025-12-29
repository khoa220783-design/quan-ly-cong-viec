// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TaskManager {
    struct Task {
        address owner;
        address assignedTo;
        string title;
        string description;
        uint256 deadline;
        uint256 reward;
        bool completed;
        bool rewardClaimed;
    }

    uint256 private _count;
    mapping(uint256 => Task) private _tasks;

    event TaskCreated(uint256 indexed id, address indexed owner, string title, string desc, uint256 deadline);
    event TaskUpdated(uint256 indexed id, string title, string desc, uint256 deadline);
    event TaskDeleted(uint256 indexed id);

    function taoCongViec(string memory t, string memory d, uint256 h) public {
        _count++;
        _tasks[_count] = Task({
            owner: msg.sender,
            assignedTo: address(0),
            title: t,
            description: d,
            deadline: h,
            reward: 0,
            completed: false,
            rewardClaimed: false
        });
        emit TaskCreated(_count, msg.sender, t, d, h);
    }

    function suaCongViec(uint256 id, string memory t, string memory d, uint256 h) public {
        require(_tasks[id].owner == msg.sender, "Not owner");
        _tasks[id].deadline = h;
        _tasks[id].title = t;
        _tasks[id].description = d;
        emit TaskUpdated(id, t, d, h);
    }

    function xoaCongViec(uint256 id) public {
        require(_tasks[id].owner == msg.sender, "Not owner");
        delete _tasks[id];
        emit TaskDeleted(id);
    }

    function danhDauHoanThanh(uint256 id, bool s) public {
        Task storage t = _tasks[id];
        require(t.owner == msg.sender || t.assignedTo == msg.sender, "No permission");
        t.completed = s;
    }

    function ganCongViec(uint256 id, address to) public {
        require(_tasks[id].owner == msg.sender, "Not owner");
        _tasks[id].assignedTo = to;
    }

    function themThuong(uint256 id) public payable {
        _tasks[id].reward += msg.value;
    }

    function nhanThuong(uint256 id) public {
        Task storage t = _tasks[id];
        require(t.completed, "Not completed");
        require(t.assignedTo == msg.sender, "Not assigned");
        require(!t.rewardClaimed, "Already claimed");
        require(t.reward > 0, "No reward");
        
        uint256 amount = t.reward;
        t.reward = 0;
        t.rewardClaimed = true;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
    }

    function getTaskInfo(uint256 id) public view returns (
        address o,
        address a,
        string memory t,
        string memory d,
        uint256 dl,
        uint256 r,
        bool c,
        bool rd
    ) {
        Task memory task = _tasks[id];
        return (task.owner, task.assignedTo, task.title, task.description, task.deadline, task.reward, task.completed, task.rewardClaimed);
    }

    function demTongCongViec() public view returns (uint256) {
        return _count;
    }
}