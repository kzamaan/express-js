const { v4: uuidV4 } = require('uuid');

// module scaffolding
const handler = {};

const rooms = {};

handler.socketConnection = (socket) => {
	// create room
	socket.on('create-room', (data) => {
		console.log('create-room', data);
		const roomId = uuidV4();
		socket.emit('room-created', roomId);
		rooms[roomId] = [];
	});

	socket.on('join-room', ({ roomId, peerId }) => {
		if (rooms[roomId]) {
			console.log('join-room', peerId);
			rooms[roomId].push(peerId);
			socket.join(roomId);
			socket.to(roomId).emit('user-joined', { peerId });

			socket.emit('get-users', {
				roomId,
				participants: rooms[roomId]
			});
		}

		socket.on('disconnect', () => {
			console.log('Client disconnected', peerId);
			const index = rooms[roomId]?.indexOf(peerId);
			if (index > -1) {
				rooms[roomId].splice(index, 1);
			}
			socket.to(roomId).emit('user-disconnected', peerId);
		});
	});
};

// export module
module.exports = handler;
