// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract BatchTransfer {
    function batchTransfer(address token, address[] calldata recipients, uint256[] calldata amounts) external {
        require(recipients.length == amounts.length, "Arrays length mismatch");

        IERC20 tokenContract = IERC20(token);
        for (uint256 i = 0; i < recipients.length; i++) {
            tokenContract.transferFrom(msg.sender, recipients[i], amounts[i]);
        }
    }
}
