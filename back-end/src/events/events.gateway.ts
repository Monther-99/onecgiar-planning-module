import { Logger, OnModuleInit, Req, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { planing_data } from './defalut';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  planing_data: any = planing_data;
  constructor() {}

  @SubscribeMessage('setData')
  changePer(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    this.planing_data = data;
    this.server.emit('data', this.planing_data);
   // console.log('new message',JSON.stringify(this.planing_data))
  }

  onModuleInit() {
    this.server.on('connect', (socket) => {
      socket.on('disconnect', (data) => {console.log('disconnect')});
      console.log('connect and send data')
     this.server.emit('data', this.planing_data);
    });
  }
}
