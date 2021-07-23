const create = () => {
    call('create');
};

const join = () => {
    code = document.getElementById('codeInput').value;
    firebase.database().ref('calls/' + code).get().then((snapshot) => {
        if (snapshot.exists()) {
            call('join', snapshot.val().peerID);
        }
    });
};

const call = (callMode, otherID = null) => {
    var peer = new Peer();
    var mode = callMode;

    peer.on('open', function (id) {
        peerID = id;
        if (mode == 'create') {
            generatePin(peer);
        } else {
            joinCall(peer, otherID);
        }
    });
};

function joinCall(peer, otherID) {
    openCamera(peer, 'join', otherID);
}


function generatePin(peer) {
    createCall(peer, Math.floor(100000 + Math.random() * 900000));
}

function createCall(peer, pin) {
    firebase.database().ref('calls/' + pin).get().then((snapshot) => {
        if (snapshot.exists()) {
            generatePin();
            return;
        } else {
            firebase.database().ref('calls/' + pin).set({
                peerID: peerID
            });
            console.log(pin);
            openCamera(peer, 'create');
        }
    });
}

const openCamera = (peer, callMode, otherID = null) => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
        if (callMode == 'create') {
            openRecieving(peer, stream);
        } else {
            sendStream(peer, stream, otherID);
        }
    }).catch((e) => {
        console.log('getUserMedia error: ', e);
    });
};

const openRecieving = (peer, mediaStream) => {
    console.log(peerID);
    /*peer.on('call', function(call) {
        call.answer(mediaStream);
        call.on('stream', function(stream) {
            console.log('stream: ', stream);
        });
    });*/
    peer.on('connection', function(conn) {
        conn.on('data', function(data) {
            console.log('Received ', data);
        });
    });
};

const sendStream = (peer, mediaStream, otherID) => {
    console.log('calling ', otherID);
    /*var call = peer.call(otherID, mediaStream);
    call.on('stream', function(stream) {
        console.log('stream: ', stream);
    });*/

    var conn = peer.connect(otherID);
    conn.on('open', function() {
        conn.send('hi');
        console.log('hi');
    });
};