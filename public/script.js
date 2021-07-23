var peer = new Peer();  

peer.on('open', function(id) {
  var Peerid = id;
});

function joinCall() {
    // var call = peer.call('id here', mediaStream);
        

}


// console.log(peer._id); 

function createCall() {
     firebase.database().ref("/inviteCodes").push({
        peerID : peer.id 
        // inviteCode : peer
    });
}