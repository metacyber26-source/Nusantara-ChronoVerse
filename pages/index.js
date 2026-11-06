import { useState, useEffect } from 'react';

export default function GameKutaiEra() {
  const [player, setPlayer] = useState({
    username: 'Pengelana_Nusantara',
    currentEra: 'Kutai Martadipura (Abad ke-4 M)',
    reputation: 10,
    kepingCoin: 100.00,
  });

  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [logs, setLogs] = useState([
    'Selamat datang di tepi Sungai Mahakam. Selesaikan syarat kelulusan era ini untuk membuka Era Sriwijaya & Mataram Kuno!'
  ]);

  // Syarat kelulusan Era Kutai
  const TARGET_REPUTATION = 50;
  const TARGET_COIN = 150;

  // Load data dari Neon saat pertama dibuka
  useEffect(() => {
    fetch('/api/player')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setPlayer({
            username: data.username,
            currentEra: data.current_era,
            reputation: data.reputation_score,
            kepingCoin: parseFloat(data.keping_coin),
          });
          if (data.reputation_score >= TARGET_REPUTATION && parseFloat(data.keping_coin) >= TARGET_COIN) {
            setIsCompleted(true);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Simpan data setiap ada perubahan
  const saveToDatabase = async (newRep, newCoin) => {
    try {
      await fetch('/api/player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reputation: newRep, kepingCoin: newCoin }),
      });
    } catch (err) {
      console.error('Gagal menyimpan ke Neon:', err);
    }
  };

  // Aksi 1: Ukir Yupa
  const handleUkirYupa = () => {
    const newRep = player.reputation + 5;
    const newCoin = player.kepingCoin + 15;
    setPlayer((prev) => ({ ...prev, reputation: newRep, kepingCoin: newCoin }));
    setLogs((prev) => [
      '📜 Kamu mengukir prasasti batu Yupa! (+5 Reputasi, +15 Keping Coin)',
      ...prev,
    ]);
    checkEraCompletion(newRep, newCoin);
    saveToDatabase(newRep, newCoin);
  };

  // Aksi 2: Persembahkan Sapi
  const handleTernakSapi = () => {
    if (player.kepingCoin < 20) {
      setLogs((prev) => ['⚠️ Keping Coin tidak cukup untuk membeli hewan ternak (butuh 20 Coin)!', ...prev]);
      return;
    }
    const newRep = player.reputation + 10;
    const newCoin = player.kepingCoin - 20;
    setPlayer((prev) => ({ ...prev, reputation: newRep, kepingCoin: newCoin }));
    setLogs((prev) => [
      '🐄 Kamu mempersembahkan sapi di Waprakeswara atas nama Raja Mulawarman! (+10 Reputasi, -20 Coin)',
      ...prev,
    ]);
    checkEraCompletion(newRep, newCoin);
    saveToDatabase(newRep, newCoin);
  };

  // Cek Syarat Kelulusan Era
  const checkEraCompletion = (rep, coin) => {
    if (rep >= TARGET_REPUTATION && coin >= TARGET_COIN && !isCompleted) {
      setIsCompleted(true);
      setLogs((prev) => [
        '🎉 SELAMAT! Kamu telah menyelesaikan syarat peradaban Era Kutai Martadipura!',
        '🏆 Kamu berhak mendapatkan NFT Prasasti Yupa & Sertifikat Pengelana Mahakam.',
        ...prev,
      ]);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Memuat data kerajaan...</div>;
  }

  return (
    <div style={{ maxWidth: '450px', margin: '0 auto', padding: '16px', fontFamily: 'sans-serif', background: '#1c1917', color: '#f5f5f4', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', borderBottom: '1px solid #78350f', paddingBottom: '12px', marginBottom: '16px' }}>
        <h1 style={{ color: '#f59e0b', margin: 0, fontSize: '20px' }}>NUSANTARA CHRONOVERSE</h1>
        <p style={{ fontSize: '12px', color: '#a8a29e', margin: '4px 0 0 0' }}>{player.currentEra}</p>
      </header>

      {/* Box Status Pemain */}
      <div style={{ background: '#292524', border: '1px solid #44403c', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px' }}>
          <span>Pemain:</span>
          <strong style={{ color: '#fbbf24' }}>{player.username}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px' }}>
          <span>Reputasi Target (50):</span>
          <strong style={{ color: player.reputation >= TARGET_REPUTATION ? '#34d399' : '#f87171' }}>{player.reputation} Pt</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span>Keping Coin Target (150):</span>
          <strong style={{ color: player.kepingCoin >= TARGET_COIN ? '#34d399' : '#fbbf24' }}>🪙 {player.kepingCoin}</strong>
        </div>
      </div>

      {/* Banner Kelulusan */}
      {isCompleted && (
        <div style={{ background: '#065f46', border: '1px solid #10b981', borderRadius: '8px', padding: '12px', marginBottom: '16px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#a7f3d0' }}>👑 ERA KUTAI SELESAI</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#ecfdf5' }}>
            Aset NFT Prasasti Yupa telah tercatat di database! Siap melangkah ke Era Sriwijaya?
          </p>
        </div>
      )}

      {/* Tombol Kegiatan */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '12px', color: '#d97706', textTransform: 'uppercase', margin: 0 }}>Kegiatan Kerajaan Kutai</h2>
        
        <button
          onClick={handleUkirYupa}
          style={{ padding: '12px', background: '#92400e', color: '#fff', border: '1px solid #b45309', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}
        >
          <span>📜 Ukir Prasasti Yupa</span>
          <small style={{ color: '#fef3c7' }}>+15 Coin, +5 Rep</small>
        </button>

        <button
          onClick={handleTernakSapi}
          style={{ padding: '12px', background: '#292524', color: '#fff', border: '1px solid #57534e', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}
        >
          <span>🐄 Persembahkan Ternak Sapi</span>
          <small style={{ color: '#6ee7b7' }}>+10 Rep, -20 Coin</small>
        </button>
      </div>

      {/* Jurnal */}
      <div style={{ background: '#0c0a09', border: '1px solid #292524', borderRadius: '8px', padding: '12px', height: '140px', overflowY: 'auto' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#78716c' }}>JURNAL PERJALANAN</h3>
        <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
          {logs.map((log, i) => (
            <p key={i} style={{ margin: '0 0 6px 0', borderBottom: '1px solid #1c1917', paddingBottom: '4px' }}>
              {log}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
