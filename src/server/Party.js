module.exports = class Party {
  constructor(io) {
    this.io = io; // io object instantiated by socket.io
    this.socketMap = new Map();
  }

  has(socketID) {
    return this.socketMap.has(socketID);
  }

  get(socketID) {
    return this.socketMap.get(socketID);
  }

  send(socketID, msg, data) {
    this.io.to(socketID).emit(msg, data);
  }

  broadcast(hostID, msg, data, includeHost) {
    if (this.has(hostID)) {
      const host = this.get(hostID);
      host.clients.forEach(clientID => {
        this.send(clientID, msg, data);
      });
      if (includeHost) {
        this.send(hostID, msg, data);
      }
    }
  }

  addSocket(socketID) {
    this.socketMap.set(socketID, {
      role: 'none',
      hostID: '',
      clients: new Set()
    });
    return true;
  }

  removeSocket(socketID) {
    this.leaveParty(socketID);
    this.socketMap.delete(socketID);
    return true;
  }

  startParty(socketID) {
    const socket = this.get(socketID);
    if (socket.role !== 'none') {
      this.send(
        socketID,
        'start-error',
        'Cannot start new party while in an existing party.'
      );
      return false;
    }
    socket.role = 'host';
    socket.hostID = socketID;
    socket.clients = new Set();
    this.send(socketID, 'start-success');
    return true;
  }

  joinParty(socketID, partyID) {
    if (!this.has(partyID)) {
      this.send(socketID, 'join-error', 'Party ID does not exist.');
      return false;
    }
    const joiner = this.get(socketID);
    // partyID could be the socket ID of any socket in the party
    const partyMember = this.get(partyID);
    const partyHostID = partyMember.hostID;
    const partyHost = this.get(partyHostID);
    if (partyMember.role === 'none') {
      this.send(socketID, 'join-error', 'ID specified is not in a party.');
      return false;
    }
    this.broadcast(partyHostID, 'member-joins', { id: socketID }, true);
    joiner.role = 'client';
    joiner.hostID = partyMember.hostID;
    partyHost.clients.add(socketID);
    this.send(socketID, 'join-success', {
      'party-host-id': partyHostID,
      'party-clients': [...partyHost.clients.values()]
    });
    return true;
  }

  leaveParty(socketID) {
    const leaver = this.get(socketID);
    if (leaver.role === 'none') {
      this.send(socketID, 'leave-error', 'Must be in a party to leave.');
      return false;
    }
    if (leaver.role === 'host') {
      // Leaving party as a host
      if (leaver.clients.size !== 0) {
        // Choose another host if party has clients
        const newHostID = leaver.clients.values().next().value;
        const newHost = this.get(newHostID);
        newHost.role = 'host';
        newHost.hostID = newHostID;
        newHost.clients = leaver.clients;
        newHost.clients.delete(newHostID);
        newHost.clients.forEach(clientID => {
          const client = this.get(clientID);
          client.hostID = newHostID;
        });
        this.broadcast(newHostID, 'new-host', { id: newHostID }, true);
      }
    } else {
      // Leaving party as a client
      const hostID = leaver.hostID;
      const host = this.get(hostID);
      host.clients.delete(socketID);
      this.broadcast(hostID, 'member-leaves', { id: socketID }, true);
    }
    leaver.role = 'none';
    leaver.hostID = '';
    leaver.clients = new Set();
    this.send(socketID, 'leave-success');
    return true;
  }

  sync(socketID, action, data) {
    const syncInitiator = this.get(socketID);
    if (syncInitiator.role === 'none') {
      this.send(socketID, 'sync-error', 'Must be in a party to sync playback');
      return false;
    }
    const hostID = syncInitiator.hostID;
    const host = this.get(hostID);
    const recipients = [hostID, ...host.clients.values()].filter(
      id => id !== socketID
    );
    recipients.forEach(id => {
      if (action === 'play') {
        this.send(id, 'sync-play');
      } else if (action === 'pause') {
        this.send(id, 'sync-pause');
      } else if (action === 'seek') {
        this.send(id, 'sync-seek', data);
      }
    });
    return true;
  }
};
