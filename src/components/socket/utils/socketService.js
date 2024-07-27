import {io} from 'socket.io-client';

const SOCKET_URL = '';

class WSSerive {
  inittializeSocket = async () => {
    try {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
      });
      console.log('inittializing socket ...', this.socket);

      this.socket.on('connect', data => {
        console.log('===== socket connected =====');
      });

      this.socket.on('disconnect', data => {
        console.log('===== socket disconnected =====');
      });

      this.socket.on('erro', data => {
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

  removeListener(listenerName) {
    this.socket.removeListener(listenerName);
  }
}

const socketServices = new WSSerive();

export default socketServices;
