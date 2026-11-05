'use client';

import { useState } from 'react';

export default function GameKutaiEra() {
  // State dasar pemain
  const [player, setPlayer] = useState({
    username: 'Pengelana_Nusantara',
    currentEra: 'Kutai Martadipura (Abad ke-4 M)',
    reputation: 10,
    kepingCoin: 100.00,
  });

  const [logs, setLogs] = useState([
    'Selamat datang di tepi Sungai Mahakam. Kamu memulai kehidupan di era Kutai Martadipura.'
  ]);

  // Aksi 1: Mengukir Prasasti Yupa
  const handleUkirYupa = () => {
    setPlayer((prev) => ({
      ...prev,
      reputation: prev.reputation + 5,
      kepingCoin: prev.kepingCoin + 15,
    }));
    setLogs((prev) => [
      '📜 Kamu berhasil mengukir silsilah kerajaan di batu Yupa! (+5 Reputasi, +15 Keping Coin)',
      ...prev,
    ]);
  };

  // Aksi 2: Beternak Sapi untuk Persembahan
  const handleTernakSapi = () => {
    if (player.kepingCoin < 20) {
      setLogs((prev) => ['⚠️ Keping Coin tidak cukup untuk membeli pakan ternak!', ...prev]);
      return;
    }
    setPlayer((prev) => ({
      ...prev,
      reputation: prev.reputation + 10,
      kepingCoin: prev.kepingCoin - 20,
    }));
    setLogs((prev) => [
      '🐄 Kamu mempersembahkan sapi terbaik di tanah suci Waprakeswara! (+10 Reputasi)',
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 p-4 font-sans max-w-md mx-auto">
      {/* Header Game */}
      <header className="border-b border-amber-700/50 pb-3 mb-4 text-center">
        <h1 className="text-xl font-bold text-amber-500 tracking-wide">
          NUSANTARA CHRONOVERSE
        </h1>
        <p className="text-xs text-stone-400">{player.currentEra}</p>
      </header>

      {/* Kartu Status Pemain */}
      <div className="bg-stone-800 border border-stone-700 rounded-lg p-3 mb-4 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-stone-400">Pemain:</span>
          <span className="font-semibold text-amber-400">{player.username}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-stone-400">Reputasi Kerajaan:</span>
          <span className="font-bold text-emerald-400">{player.reputation} Pt</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-stone-400">Keping Coin:</span>
          <span className="font-bold text-yellow-400">🪙 {player.kepingCoin}</span>
        </div>
      </div>

      {/* Panel Aksi / Quest Era Kutai */}
      <div className="space-y-3 mb-5">
        <h2 className="text-sm font-semibold text-amber-600 uppercase tracking-wider">
          Kegiatan Kerajaan Kutai
        </h2>
        
        <button
          onClick={handleUkirYupa}
          className="w-full bg-amber-800 hover:bg-amber-700 text-stone-100 font-medium py-2.5 px-4 rounded-md text-sm border border-amber-600/30 transition flex justify-between items-center"
        >
          <span>📜 Ukir Prasasti Yupa</span>
          <span className="text-xs text-amber-300">+15 Coin</span>
        </button>

        <button
          onClick={handleTernakSapi}
          className="w-full bg-stone-800 hover:bg-stone-700 text-stone-100 font-medium py-2.5 px-4 rounded-md text-sm border border-stone-600 transition flex justify-between items-center"
        >
          <span>🐄 Persembahkan Ternak Sapi</span>
          <span className="text-xs text-emerald-300">+10 Reputasi</span>
        </button>
      </div>

      {/* Jurnal Catatan / Game Log */}
      <div className="bg-stone-950 border border-stone-800 rounded-lg p-3 h-40 overflow-y-auto">
        <h3 className="text-xs font-semibold text-stone-500 mb-2">JURNAL PERJALANAN</h3>
        <div className="space-y-1.5 text-xs text-stone-300">
          {logs.map((log, index) => (
            <p key={index} className="border-b border-stone-800/40 pb-1">
              {log}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
