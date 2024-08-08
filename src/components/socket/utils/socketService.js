import {io} from 'socket.io-client';

const SOCKET_URL = 'http://10.0.2.2:8000/';

class WSSerive {
  inittializeSocket = async () => {
    try {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
      });
      console.log('inittializing socket ...');

      this.socket.on('connect', data => {
        console.log('===== socket connected =====');
      });

      this.socket.on('disconnect', data => {
        console.log('===== socket disconnected =====');
      });

      this.socket.on('error', data => {
        console.log('socket error ', data);
      });
    } catch (error) {
      console.log('socket is not inialized ', error);
    }
  };

  emit(even, data = {}) {
    this.socket.emit(even, data);
  }

  on(even, cb) {
    this.socket.on(even, cb);
  }

  off(event, cb) {
    this.socket.off(event, cb);
  }

  removeListener(listenerName) {
    this.socket.removeListener(listenerName);
  }
}

const socketServices = new WSSerive();

export default socketServices;
