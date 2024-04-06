import ActionCable, { type CreateMixin } from 'actioncable';

export const useActionCable = (
  channelName: string,
  roomId: number,
  connectCallable: CreateMixin = {
    connected() {
      console.log('connected', `channel: ${channelName}`);
    },
    disconnected() {
      console.log('disconnected');
    },
    received(data: any) {
      console.log('received', data);
    }
  }
) => {
  const cable = ActionCable.createConsumer(`ws://localhost:3000/shogi_cable`);
  const channel = cable.subscriptions.create(
    { channel: 'ShogiChannel', room_id: roomId },
    connectCallable
  );

  return { channel };
};
