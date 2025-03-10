import db from './db.js';
module.exports = {
	port: process.env.port,
	db:db.development,
	logger: {
		maxSize: 512000,
		maxFiles: 100
	}
};
