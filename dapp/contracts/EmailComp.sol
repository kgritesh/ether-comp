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
    uint expiry;
  }

  mapping(string => address) receiverMap;

  mapping(string => mapping(string => Bid)) bidMap;

  event BidCreated(
    address senderAddr,
    string receiver,
    string messageId,
    uint256 bid,
    uint expiry
  );

  event BidCancelled(
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

 function sendBid(string receiver, string messageId, uint expiry) payable {
   require(checkExistingReceiver(receiver));
   require(!checkExistingBid(receiver, messageId));
   Bid memory bid  = Bid(msg.sender, receiver, messageId, msg.value, expiry);
   bidMap[receiver][messageId] = bid;
   BidCreated(msg.sender, receiver, messageId, msg.value, expiry);
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
   delete bidMap[receiver][messageId];
   BidCancelled(receiver, messageId);
 }

 function payBid(string receiver, string messageId) onlyOwner {
   require(checkExistingBid(receiver, messageId));
   Bid storage emailBid = bidMap[receiver][messageId];
   uint256 bid = emailBid.bid;
   address receiverAddr = receiverMap[receiver];
   delete bidMap[receiver][messageId];
   if (!receiverAddr.send(bid)) {
     bidMap[receiver][messageId] = emailBid;
     CompPaymentFailed(receiver, messageId, receiverAddr, bid);
     return;
   }
   CompPaid(receiver, messageId, receiverAddr, bid);
 }

}
