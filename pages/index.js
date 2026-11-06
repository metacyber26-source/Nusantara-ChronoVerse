import { useState, useEffect } from 'react';

export default function GameKutaiAdventure() {
  const [player, setPlayer] = useState({
    username: 'Pengelana_Nusantara',
    currentEra: 'Kutai Martadipura (Abad ke-4 M)',
    reputation: 15,
    kepingCoin: 110.00,
  });

  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Status Narasi Petualangan Saat Ini
  const [adventureStory, setAdventureStory] = useState(
    'Kamu berdiri di tepi Sungai Mahakam yang deras. Para pendeta Brahmana sedang memimpin upacara suci di tanah Waprakeswara. Apa yang ingin kamu lakukan?'
  );
  
  const [choices, setChoices] = useState([
    {
      id: 1,
      text: '📜 Menawarkan diri membantu Brahmana mengukir Prasasti Yupa',
      repChange: 5,
      coinChange: 15,
      storyResult: 'Kamu berhasil mengukir silsilah Raja Mulawarman dengan teliti di atas batu. Para pendeta memujimu!'
    },
    {
      id: 2,
      text: '⛵ Menjelajahi pedagang sungai dan barter hasil rempah',
      repChange: 2,
      coinChange: 25,
      storyResult: 'Kamu sukses berdagang dengan saudagar asing yang berlabuh di muara sungai.'
    },
    {
      id: 3,
      text: '🐄 Menyumbangkan ternak sapi untuk korban kekeringan rakyat',
      repChange: 15,
      coinChange: -30,
      storyResult: 'Rakyat jelata bersorak gembira atas kedermawananmu! Reputasimu melonjak di hadapan istana.'
    }
  ]);

  const [logs, setLogs] = useState([
    'Petualangan dimulai di tanah subur Kutai Martadipura.'
  ]);

  const TARGET_REPUTATION = 50;
  const TARGET_COIN = 150;

  // Load data dari database Neon
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
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const saveToDatabase = async (newRep, newCoin) => {
    try {
      await fetch('/api/player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reputation: newRep, kepingCoin: newCoin }),
      });
    } catch (err) {
      console.error('Gagal simpan:', err);
    }
  };

  // Pilih Tindakan Petualangan
  const handleChoice = (choice) => {
    if (player.kepingCoin + choice.coinChange < 0) {
      alert('Keping Coin kamu tidak mencukupi untuk pilihan ini!');
      return;
    }

    const newRep = player.reputation + choice.repChange;
    const newCoin = player.kepingCoin + choice.coinChange;

    setPlayer((prev) => ({ ...prev, reputation: newRep, kepingCoin: newCoin }));
    setAdventureStory(choice.storyResult);
    
    setLogs((prev) => [
      `[Petualangan] ${choice.storyResult} (Rep: ${choice.repChange > 0 ? '+' : ''}${choice.repChange}, Coin: ${choice.coinChange > 0 ? '+' : ''}${choice.coinChange})`,
      ...prev,
    ]);

    if (newRep >= TARGET_REPUTATION && newCoin >= TARGET_COIN) {
      setIsCompleted(true);
    }

    saveToDatabase(newRep, newCoin);
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#fff', background: '#1c1917', minHeight: '100vh' }}>Menyiapkan peta petualangan...</div>;
  }

  return (
    <div style={{ maxWidth: '450px', margin: '0 auto', padding: '16px', fontFamily: 'sans-serif', background: '#12100e', color: '#f5f5f4', minHeight: '100vh', boxSizing: 'border-box' }}>
      
      {/* Header Game */}
      <header style={{ textAlign: 'center', borderBottom: '1px solid #78350f', paddingBottom: '10px', marginBottom: '14px' }}>
        <h1 style={{ color: '#f59e0b', margin: 0, fontSize: '18px', letterSpacing: '1px' }}>NUSANTARA CHRONOVERSE</h1>
        <p style={{ fontSize: '11px', color: '#a8a29e', margin: '3px 0 0 0' }}>🗺️ Babak Petualangan: {player.currentEra}</p>
      </header>

      {/* Panel Status Karakter */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
        <div style={{ background: '#1e1b18', border: '1px solid #44403c', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: '#a8a29e', display: 'block' }}>REPUTASI ({TARGET_REPUTATION})</span>
          <strong style={{ fontSize: '16px', color: player.reputation >= TARGET_REPUTATION ? '#34d399' : '#f59e0b' }}>
            {player.reputation} Pt
          </strong>
        </div>
        <div style={{ background: '#1e1b18', border: '1px solid #44403c', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: '#a8a29e', display: 'block' }}>KEPING COIN ({TARGET_COIN})</span>
          <strong style={{ fontSize: '16px', color: '#fbbf24' }}>
            🪙 {player.kepingCoin}
          </strong>
        </div>
      </div>

      {/* Banner Selesai Era */}
      {isCompleted ? (
        <div style={{ background: '#065f46', border: '1px solid #10b981', borderRadius: '8px', padding: '12px', marginBottom: '14px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#a7f3d0' }}>👑 ERA KUTAI DITAKLUKKAN!</h3>
          <p style={{ margin: 0, fontSize: '11px', color: '#ecfdf5' }}>
            Kisah petualanganmu terukir abadi. Siap berlayar menuju Era Sriwijaya?
          </p>
        </div>
      ) : (
        /* Kotak Narasi / Cerita Petualangan */
        <div style={{ background: '#1c1917', border: '1px solid #78350f', borderRadius: '8px', padding: '14px', marginBottom: '14px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#d97706', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
            📖 Kejadian Saat Ini:
          </span>
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#e7e5e4', margin: 0 }}>
            {adventureStory}
          </p>
        </div>
      )}

      {/* Pilihan Tindakan Petualangan */}
      {!isCompleted && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontSize: '11px', color: '#a8a29e', textTransform: 'uppercase', fontWeight: 'bold' }}>
            Tentukan Langkah Petualanganmu:
          </span>
          
          {choices.map((item) => (
            <button
              key={item.id}
              onClick={() => handleChoice(item)}
              style={{
                padding: '12px',
                background: '#292524',
                color: '#fafaf9',
                border: '1px solid #57534e',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '12px',
                transition: 'all 0.2s',
                lineHeight: '1.4'
              }}
            >
              {item.text}
              <div style={{ fontSize: '10px', color: '#fbbf24', marginTop: '4px' }}>
                Hadiah: {item.repChange > 0 ? `+${item.repChange} Rep` : `${item.repChange} Rep`} | {item.coinChange > 0 ? `+${item.coinChange} Coin` : `${item.coinChange} Coin`}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Jurnal Riwayat Perjalanan */}
      <div style={{ background: '#0c0a09', border: '1px solid #292524', borderRadius: '8px', padding: '10px', height: '120px', overflowY: 'auto' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '10px', color: '#78716c', textTransform: 'uppercase' }}>Catatan Perjalanan</h3>
        <div style={{ fontSize: '11px', lineHeight: '1.4', color: '#d6d3d1' }}>
          {logs.map((log, i) => (
            <p key={i} style={{ margin: '0 0 4px 0', borderBottom: '1px solid #1c1917', paddingBottom: '3px' }}>
              • {log}
            </p>
          ))}
        </div>
      </div>

    </div>
  );
}
