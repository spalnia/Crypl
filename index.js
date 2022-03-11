// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract DonationWallet is Ownable {
    address[] private contributors;
    mapping(address => bool) private _isContributor;
    mapping(address => uint256) private _contributedAmount;

    function withdrawDonations(address payable _destination) public onlyOwner {
        require(
            address(this).balance != 0,
            "There is no ether on this contract"
        );
        uint256 _amount = address(this).balance;
        (bool sent, ) = _destination.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }

    function donate() public payable {
        require(msg.value != 0, "You can not donate nothing");
        _setContributor(_msgSender());
        _contributedAmount[_msgSender()] += msg.value;
    }

    function getAllContributors() public view returns (address[] memory) {
        return contributors;
    }

    // Alternative to donate(), receives ether as a donation in case msg.data was empty
    receive() external payable {
        _setContributor(_msgSender());
        _contributedAmount[_msgSender()] += msg.value;
    }

    function _setContributor(address _contributor) private {
        if (_isContributor[_contributor] != true) {
            _isContributor[_contributor] = true;
            contributors.push(_contributor);
        }
    }
}
