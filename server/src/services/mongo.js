import mongoose from 'mongoose';

const MONGO_URL = "mongodb+srv://majk:qi3EUS2Wje91HR79@nasa-project.yvczt.mongodb.net/?retryWrites=true&w=majority&appName=nasa-project"

mongoose.connection.once('open', () => {
	console.log('MongoDB connection ready');
});

mongoose.connection.on('error', (err) => {
	console.error(err);
});

export async function mongoConnect() {
	await mongoose.connect(MONGO_URL);
}

export async function mongoDisconnect() {
	await mongoose.disconnect();
}