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
    console.error('❌ CRÍTICO: MONGODB_URI no definida. El sistema no podrá conectar.');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5 segundos para fallar si no hay conexión
      connectTimeoutMS: 10000,       // 10 segundos para el handshake inicial
      family: 4                      // Forzar IPv4 para evitar problemas de DNS en algunos entornos
    };

    console.log('🔄 Intentando conectar a MongoDB Atlas...');
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ CONEXIÓN EXITOSA: Base de datos vinculada correctamente.');
        return mongoose;
      })
      .catch((err) => {
        console.error('❌ ERROR DE CONEXIÓN A MONGO:');
        console.error('   Mensaje:', err.message);
        console.error('   Código:', err.code);
        if (err.message.includes('ECONNREFUSED')) {
          console.error('   Diagnóstico: La IP no está en la Whitelist de Atlas.');
        } else if (err.message.includes('Authentication failed')) {
          console.error('   Diagnóstico: Usuario o contraseña incorrectos en MONGODB_URI.');
        }
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    return null;
  }

  return cached.conn;
}

export default dbConnect;
