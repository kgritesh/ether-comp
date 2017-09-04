pragma solidity ^0.4.15;

contract owned {
    function owned() { owner = msg.sender; }
    address owner;

    modifier onlyOwner {
      require(msg.sender == owner);
      _;
    }
}

contract EmailComp is owned {
  struct Bid {
    address senderAddr;
    string receiver;
    string messageId;
    uint256 bid;
    uint256 bidOn;
    bool cancellable;
    uint expiry;  // in days
  }

  mapping(string => address) receiverMap;

  mapping(string => mapping(string => Bid)) bidMap;

  event BidCreated(
    address senderAddr,
    string receiver,
    string messageId,
    uint256 bid,
    uint256 bidOn,
    uint expiry
  );

  event BidCancelled(
    string receiver,
    string messageId
  );

  event BidExpired(
    string receiver,
    string messageId
  );

  event CompPaid(
    string receiver,
    string messageId,
    address receiverAddr,
    uint256 bid
  );

  event CompPaymentFailed(
    string receiver,
    string messageId,
    address receiverAddr,
    uint256 bid
  );

  function registerReceiver(string email, address addr) onlyOwner {
    receiverMap[email] = addr;
  }

  function checkExistingReceiver(string receiver) internal returns (bool) {
    return receiverMap[receiver] != address(0);
  }

  function checkExistingBid(string receiver, string messageId) internal returns (bool) {
   mapping(string => Bid) receiverBids = bidMap[receiver];
   Bid memory existing = receiverBids[messageId];
   return sha3(existing.messageId) == sha3(messageId);
  }

  function checkBidExpiry(Bid bid)  internal returns(bool) {
    return now > bid.bidOn + (bid.expiry * 1 days);
  }

  function sendBid(string receiver, string messageId, uint expiry) external payable {
    require(checkExistingReceiver(receiver));
    require(!checkExistingBid(receiver, messageId));
    Bid memory bid  = Bid({
      senderAddr: msg.sender,
          receiver: receiver,
          messageId: messageId,
          bid: msg.value,
          bidOn: now,
          cancellable: true,
          expiry: expiry
          });
    bidMap[receiver][messageId] = bid;
    BidCreated(msg.sender, receiver, messageId, msg.value, now, expiry);
  }

  function getBid(string receiver, string messageId) returns (uint256, uint) {
    require(checkExistingBid(receiver, messageId));
    Bid storage bid = bidMap[receiver][messageId];
    return (bid.bid, bid.expiry);
  }

  function cancelBid(string receiver, string messageId) {
    require(checkExistingBid(receiver, messageId));
    Bid storage bid = bidMap[receiver][messageId];
    require(msg.sender == bid.senderAddr || msg.sender == owner );
    require(bid.cancellable);
    delete bidMap[receiver][messageId];
    BidCancelled(receiver, messageId);
  }

  function payBid(string receiver, string messageId) onlyOwner {
    require(checkExistingBid(receiver, messageId));
    Bid storage emailBid = bidMap[receiver][messageId];
    address receiverAddr = receiverMap[receiver];

    // Check if bid expired
    if (checkBidExpiry(emailBid)) {
      delete bidMap[receiver][messageId];
      BidExpired(receiver, messageId);
      return;
    }

    uint256 bid = emailBid.bid;
    emailBid.cancellable = false;

    if (!receiverAddr.send(bid)) {
      // Payment Failed
      CompPaymentFailed(receiver, messageId, receiverAddr, bid);
      return;
    }
    delete bidMap[receiver][messageId];
    CompPaid(receiver, messageId, receiverAddr, bid);
  }

}
