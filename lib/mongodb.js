import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  if (process.env.NODE_ENV === 'production') {
    console.warn('⚠️ MONGODB_URI no está definida. Esto es esperado durante el build de Vercel si no se han configurado las variables de entorno aún.');
  } else {
    throw new Error('Por favor, define la variable MONGODB_URI en tu archivo .env.local');
  }
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (!MONGODB_URI) {
    console.error('❌ Intento de conexión a MongoDB sin URI. Asegúrate de configurar MONGODB_URI en Vercel.');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
