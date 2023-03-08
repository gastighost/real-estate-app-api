import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class WebsocketsGateway {
  @SubscribeMessage('message')
  handleEvent(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.emit('message', { message });
  }
}
