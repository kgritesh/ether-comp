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

  event BidEvent(
    address senderAddr,
    string receiver,
    string messageId,
    uint256 bid,
    uint expiry
  );

  event EmailReplied(
    string receiver,
    string messageId
  );

  function registerReceiver(string email, address addr) onlyOwner {
    receiverMap[email] = addr;
  }

  function checkExistingBid(string receiver, string messageId) internal returns (bool) {
   mapping(string => Bid) receiverBids = bidMap[receiver];
   Bid memory existing = receiverBids[messageId];
   return sha3(existing.messageId) == sha3(messageId);
 }

 function sendBid(string receiver, string messageId, uint expiry) payable {
   require(checkExistingBid(receiver, messageId));
   Bid memory bid  = Bid(msg.sender, receiver, messageId, msg.value, expiry);
   bidMap[receiver][messageId] = bid;
   BidEvent(msg.sender, receiver, messageId, msg.value, expiry);
 }

 function cancelBid(string receiver, string messageId) {
   require(!checkExistingBid(receiver, messageId));
   Bid storage bid = bidMap[receiver][messageId];
   require(msg.sender == bid.senderAddr || msg.sender == owner );
   delete bidMap[receiver][messageId];
 }

 function payBid(string receiver, string messageId) onlyOwner {
   require(!checkExistingBid(receiver, messageId));
   Bid storage emailBid = bidMap[receiver][messageId];
   uint256 bid = emailBid.bid;
   address receiverAddr = receiverMap[receiver];
   delete bidMap[receiver][messageId];
   receiverAddr.transfer(bid);
   EmailReplied(receiver, messageId);
 }

}
