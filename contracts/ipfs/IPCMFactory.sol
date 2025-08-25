// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ipcm.sol";

contract IPCMFactory is Ownable {
    IPCM[] public ipcmInstances;
    mapping(address => uint256[]) public userInstances;
    
    event IPCMCreated(address indexed instance, address indexed owner, uint256 index);
    event InstanceRemoved(address indexed instance, uint256 index);

    constructor(address owner) Ownable(owner) {}

    function createIPCM(address owner) public returns (address) {
        IPCM newInstance = new IPCM(owner);
        ipcmInstances.push(newInstance);
        userInstances[owner].push(ipcmInstances.length - 1);
        
        emit IPCMCreated(address(newInstance), owner, ipcmInstances.length - 1);
        return address(newInstance);
    }

    function getInstanceCount() public view returns (uint256) {
        return ipcmInstances.length;
    }

    function getInstance(uint256 index) public view returns (address) {
        require(index < ipcmInstances.length, "Index out of bounds");
        return address(ipcmInstances[index]);
    }

    function getUserInstances(address user) public view returns (uint256[] memory) {
        return userInstances[user];
    }

    function getAllInstances() public view returns (address[] memory) {
        address[] memory instances = new address[](ipcmInstances.length);
        for (uint256 i = 0; i < ipcmInstances.length; i++) {
            instances[i] = address(ipcmInstances[i]);
        }
        return instances;
    }

    function removeInstance(uint256 index) public onlyOwner {
        require(index < ipcmInstances.length, "Index out of bounds");
        
        address instanceToRemove = address(ipcmInstances[index]);
        
        // Rimuovi l'istanza dall'array
        ipcmInstances[index] = ipcmInstances[ipcmInstances.length - 1];
        ipcmInstances.pop();
        
        emit InstanceRemoved(instanceToRemove, index);
    }
} 