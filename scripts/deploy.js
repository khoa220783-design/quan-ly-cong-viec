const hre = require("hardhat");

async function main() {
    console.log("Deploying TaskManager...");

    const TaskManager = await hre.ethers.getContractFactory("TaskManager");
    const taskManager = await TaskManager.deploy({
        gasLimit: 8000000 // 8 triệu gas - đủ cho mọi trường hợp
    });

    await taskManager.waitForDeployment();

    const address = await taskManager.getAddress();
    console.log("✅ TaskManager deployed to:", address);
    console.log("");
    console.log("📝 Hãy copy địa chỉ này vào file .env:");
    console.log(`VITE_CONTRACT_ADDRESS=${address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
