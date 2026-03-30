// lib/mongodb.js - Deprecated in favor of JSON storage
export default async function dbConnect() {
  console.log('Using local JSON storage instead of MongoDB.');
  return true;
}
