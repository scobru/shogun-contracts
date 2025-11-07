// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title Counter
 * @author Matt Condon (@shrugs)
 * @dev Provides an incrementing uint256 id acquired by the `Counter#next` getter.
 * Use this for issuing ERC721 ids or keeping track of request ids, anything you want, really.
 *
 * Include with `using Counter for Counter.Counter;`
 * @notice Does not allow an Id of 0, which is popularly used to signify a null state in solidity.
 * Does not protect from overflows, but if you have 2^256 ids, you have other problems.
 * (But actually, it's generally impossible to increment a counter this many times, energy wise
 * so it's not something you have to worry about.)
 */
library Counters {

  struct Counter {
    uint256 current; // default: 0
  }

  /**
   * @dev Increment the counter and return the new value
   */
  function next(Counter storage index) internal returns (uint256) {
    index.current += 1;
    return index.current;
  }

  /**
   * @dev Increment the counter without returning the value
   */
  function increment(Counter storage index) internal {
    index.current += 1;
  }

  /**
   * @dev Get the current value without incrementing
   */
  function get(Counter storage index) internal view returns (uint256) {
    return index.current;
  }

  /**
   * @dev Decrement the counter
   */
  function decrement(Counter storage index) internal {
    require(index.current > 0, "Counter: decrement overflow");
    index.current -= 1;
  }

  /**
   * @dev Reset the counter to zero
   */
  function reset(Counter storage index) internal {
    index.current = 0;
  }
}