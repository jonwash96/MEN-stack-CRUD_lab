require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI+process.env.MONGODB_DB);

mongoose.connection.on('connected', () => console.log("MongoDB is connected on", mongoose.connection.name))
mongoose.connection.on('error', (err) => console.log("MongoDB had an error connecting", err))