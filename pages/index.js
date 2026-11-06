import { useState, useEffect } from 'react';

export default function GameMetaverseKutai() {
  const [player, setPlayer] = useState({
    username: 'Pengelana_Nusantara',
    reputation: 10,
    kepingCoin: 100.00,
  });

  // Posisi Avatar di Grid Peta (X, Y) dari 0 sampai 4
  const [pos, setPos] = useState({ x: 2, y: 2 });
  const [message, setMessage] = useState('Gunakan tombol arah untuk menggerakkan avatar menjelajahi tepian Sungai Mahakam.');
  const [isCompleted, setIsCompleted] = useState(false);

  const TARGET_REP = 50;
  const TARGET_COIN = 150;

  // Load data dari Neon
  useEffect(() => {
    fetch('/api/player')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setPlayer({
            username: data.username,
            reputation: data.reputation_score,
            kepingCoin: parseFloat(data.keping_coin),
          });
          if (data.reputation_score >= TARGET_REP && parseFloat(data.keping_coin) >= TARGET_COIN) {
            setIsCompleted(true);
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const saveToDatabase = async (newRep, newCoin) => {
    try {
      await fetch('/api/player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reputation: newRep, kepingCoin: newCoin }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Fungsi Gerakan Avatar
  const movePlayer = (dx, dy) => {
    const newX = Math.max(0, Math.min(4, pos.x + dx));
    const newY = Math.max(0, Math.min(4, pos.y + dy));
    setPos({ x: newX, y: newY });

    // Event interaksi berdasarkan lokasi koordinat peta
    let earnedRep = 0;
    let earnedCoin = 0;
    let locMessage = 'Kamu menyusuri hutan rimba di tepi Sungai Mahakam.';

    if (newX === 1 && newY === 1) {
      locMessage = '📜 Kamu tiba di Situs Prasasti Yupa! Mengukir sejarah memberi +5 Reputasi & +15 Keping.';
      earnedRep = 5;
      earnedCoin = 15;
    } else if (newX === 3 && newY === 3) {
      locMessage = '⛵ Kamu menjumpai dermaga kapal dagang Nusantara! Berdagang rempah memberi +10 Keping.';
      earnedRep = 2;
      earnedCoin = 10;
    } else if (newX === 4 && newY === 1) {
      locMessage = '🛕 Kamu memasuki tanah suci Waprakeswara tempat upacara Brahmana! +10 Reputasi.';
      earnedRep = 10;
      earnedCoin = -5;
    }

    if (earnedRep !== 0 || earnedCoin !== 0) {
      const updatedRep = player.reputation + earnedRep;
      const updatedCoin = player.kepingCoin + earnedCoin;

      setPlayer({
        ...player,
        reputation: updatedRep,
        kepingCoin: updatedCoin,
      });

      if (updatedRep >= TARGET_REP && updatedCoin >= TARGET_COIN) {
        setIsCompleted(true);
        setMessage('👑 SELAMAT! Era Kutai Martadipura berhasil ditaklukkan sepenuhnya!');
      } else {
        setMessage(locMessage);
      }

      saveToDatabase(updatedRep, updatedCoin);
    } else {
      setMessage(locMessage);
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '0 auto', padding: '16px', fontFamily: 'sans-serif', background: '#0f172a', color: '#f8fafc', minHeight: '100vh', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <header style={{ textAlign: 'center', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '12px' }}>
        <h1 style={{ color: '#fbbf24', margin: 0, fontSize: '18px' }}>NUSANTARA METAVERSE</h1>
        <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>Era 1: Kutai Martadipura (Abad ke-4 M)</p>
      </header>

      {/* Status Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', background: '#1e293b', padding: '8px 12px', borderRadius: '6px', marginBottom: '12px', fontSize: '12px' }}>
        <span>Reputasi: <strong style={{ color: '#34d399' }}>{player.reputation}/{TARGET_REP}</strong></span>
        <span>Coin: <strong style={{ color: '#facc15' }}>🪙 {player.kepingCoin}</strong></span>
      </div>

      {/* Banner Selesai */}
      {isCompleted && (
        <div style={{ background: '#065f46', padding: '10px', borderRadius: '6px', textAlign: 'center', marginBottom: '12px', fontSize: '12px', border: '1px solid #10b981' }}>
          🎉 <strong>ERA KUTAI SELESAI!</strong> Siap menyeberang ke Era Sriwijaya.
        </div>
      )}

      {/* PETA METAVERSE GRID 5x5 */}
      <div style={{ background: '#090d16', border: '2px solid #334155', borderRadius: '8px', padding: '10px', marginBottom: '12px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', aspectRatio: '1/1' }}>
        {Array.from({ length: 5 }).map((_, y) =>
          Array.from({ length: 5 }).map((_, x) => {
            const isPlayerHere = pos.x === x && pos.y === y;
            let icon = '🌲'; // Hutan default
            if (x === 1 && y === 1) icon = '🗿'; // Yupa
            if (x === 3 && y === 3) icon = '⛵'; // Dermaga
            if (x === 4 && y === 1) icon = '🛕'; // Waprakeswara

            return (
              <div
                key={`${x}-${y}`}
                style={{
                  background: isPlayerHere ? '#3b82f6' : '#1e293b',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  border: isPlayerHere ? '2px solid #60a5fa' : '1px solid #334155',
                  boxShadow: isPlayerHere ? '0 0 10px rgba(59,130,246,0.5)' : 'none'
                }}
              >
                {isPlayerHere ? '🧙‍♂️' : icon}
              </div>
            );
          })
        )}
      </div>

      {/* Kotak Interaksi / Narasi Lokasi */}
      <div style={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '6px', padding: '10px', marginBottom: '14px', minHeight: '45px', fontSize: '12px', lineHeight: '1.4', color: '#e2e8f0' }}>
        💬 {message}
      </div>

      {/* KONTROL NAVIGASI AVATAR (D-PAD) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', maxWidth: '180px', margin: '0 auto' }}>
        <div></div>
        <button onClick={() => movePlayer(0, -1)} style={{ padding: '12px', background: '#334155', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>⬆️</button>
        <div></div>

        <button onClick={() => movePlayer(-1, 0)} style={{ padding: '12px', background: '#334155', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>⬅️</button>
        <button onClick={() => movePlayer(0, 1)} style={{ padding: '12px', background: '#334155', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>⬇️</button>
        <button onClick={() => movePlayer(1, 0)} style={{ padding: '12px', background: '#334155', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>➡️</button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '10px', color: '#64748b' }}>
        Petunjuk: Gerakkan avatar (🧙‍♂️) ke ikon 🗿, ⛵, dan 🛕 untuk mengumpulkan poin sejarah!
      </div>

    </div>
  );
}
