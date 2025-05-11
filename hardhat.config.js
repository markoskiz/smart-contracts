require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/PdtXHBhz2SiITzbRPXISIQpp_w5W2sNJ",
      accounts: ["0xe8e57bdebdff6302fde4ba492283b5394622889eb91bc95a700c55fdd3fda236"],
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
