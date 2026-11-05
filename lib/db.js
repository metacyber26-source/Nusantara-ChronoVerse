import { neon } from '@neondatabase/serverless';

// Mengambil URL koneksi dari Environment Variable Vercel
const sql = neon(process.env.DATABASE_URL);

export default sql;
