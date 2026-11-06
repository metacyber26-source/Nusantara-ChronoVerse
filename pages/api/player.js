import sql from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Ambil data pemain (jika belum ada, buat data baru)
    try {
      let players = await sql`SELECT * FROM players WHERE id = 'player_demo'`;
      if (players.length === 0) {
        await sql`
          INSERT INTO players (id, username, current_era, reputation_score, keping_coin)
          VALUES ('player_demo', 'Pengelana_Nusantara', 'Kutai Martadipura', 10, 100.00)
        `;
        players = await sql`SELECT * FROM players WHERE id = 'player_demo'`;
      }
      return res.status(200).json(players[0]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    // Update koin & reputasi ke database Neon
    const { reputation, kepingCoin } = req.body;
    try {
      await sql`
        UPDATE players 
        SET reputation_score = ${reputation}, keping_coin = ${kepingCoin}
        WHERE id = 'player_demo'
      `;
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
