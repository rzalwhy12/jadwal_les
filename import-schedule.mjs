// Script import jadwal dari whiteboard ke Backendless
// Jalankan: node import-schedule.mjs

const APP_ID = '67379D65-75BC-4268-A969-068219CCD64B';
const API_KEY = '4DC406E3-7AD2-4CF7-8AEE-F2FF98092C4C';
const BASE_URL = `https://api.backendless.com/${APP_ID}/${API_KEY}/data/Schedule`;

// ============================================================
// DATA JADWAL (dibaca dari foto whiteboard)
// Format: { day, timeSlot, studentName, instrument, mode, room }
//
// Instrument: K=Keyboard, G=Gitar, B=Bass, D=Drum, V=Vokal, S=Sax, Bi=Biola
// Mode:       R=Reguler, O=Online, P=Private
// Room:       1 = atas diagonal, 2 = bawah diagonal
// ============================================================
const scheduleItems = [

  // ── SENIN ─────────────────────────────────────────────────
  { day: 'Senin', timeSlot: '09:00', studentName: 'Aril',   instrument: 'K', mode: 'R', room: 1 },
  { day: 'Senin', timeSlot: '14:00', studentName: 'Leticia',instrument: 'K', mode: 'R', room: 1 },
  { day: 'Senin', timeSlot: '15:00', studentName: 'Imm',    instrument: 'K', mode: 'R', room: 1 },
  { day: 'Senin', timeSlot: '18:00', studentName: 'Jojo',   instrument: 'K', mode: 'R', room: 1 },
  { day: 'Senin', timeSlot: '19:00', studentName: 'Rachel', instrument: 'K', mode: 'R', room: 1 },

  // ── SELASA ────────────────────────────────────────────────
  { day: 'Selasa', timeSlot: '13:00', studentName: 'Asyik',        instrument: 'G', mode: 'R', room: 1 },
  { day: 'Selasa', timeSlot: '14:00', studentName: 'Richtem Alvin',instrument: 'G', mode: 'R', room: 1 },
  { day: 'Selasa', timeSlot: '14:00', studentName: 'C.Maria',      instrument: 'G', mode: 'R', room: 2 },
  { day: 'Selasa', timeSlot: '15:00', studentName: 'Fabila',       instrument: 'G', mode: 'R', room: 1 },
  { day: 'Selasa', timeSlot: '16:00', studentName: 'Alisa',        instrument: 'D', mode: 'R', room: 1 },
  { day: 'Selasa', timeSlot: '16:00', studentName: 'Aroan',        instrument: 'G', mode: 'R', room: 2 },
  { day: 'Selasa', timeSlot: '17:00', studentName: 'B.Yoan',       instrument: 'K', mode: 'O', room: 1 },
  { day: 'Selasa', timeSlot: '18:00', studentName: 'Jeni',         instrument: 'K', mode: 'R', room: 1 },
  { day: 'Selasa', timeSlot: '19:00', studentName: 'Kenzo',        instrument: 'K', mode: 'R', room: 1 },
  { day: 'Selasa', timeSlot: '19:00', studentName: 'Cika',         instrument: 'B', mode: 'R', room: 2 },

  // ── RABU ──────────────────────────────────────────────────
  { day: 'Rabu', timeSlot: '09:00', studentName: 'Budi',   instrument: 'K', mode: 'R', room: 1 },
  { day: 'Rabu', timeSlot: '13:00', studentName: 'Ellove', instrument: 'V', mode: 'R', room: 1 },
  { day: 'Rabu', timeSlot: '14:00', studentName: 'Ozil',   instrument: 'K', mode: 'P', room: 1 },
  { day: 'Rabu', timeSlot: '14:00', studentName: 'Hailey', instrument: 'V', mode: 'P', room: 2 },
  { day: 'Rabu', timeSlot: '15:00', studentName: 'Vanesa', instrument: 'K', mode: 'P', room: 1 },
  { day: 'Rabu', timeSlot: '16:00', studentName: 'Joyce',  instrument: 'K', mode: 'R', room: 1 },
  { day: 'Rabu', timeSlot: '17:00', studentName: 'Ryan',   instrument: 'V', mode: 'R', room: 1 },
  { day: 'Rabu', timeSlot: '17:00', studentName: 'Dela',   instrument: 'V', mode: 'R', room: 2 },
  { day: 'Rabu', timeSlot: '18:00', studentName: 'Novin',  instrument: 'K', mode: 'O', room: 1 },
  { day: 'Rabu', timeSlot: '19:00', studentName: 'Mita',   instrument: 'K', mode: 'O', room: 1 },
  { day: 'Rabu', timeSlot: '20:00', studentName: 'Lbo',    instrument: 'K', mode: 'O', room: 1 },

  // ── KAMIS ─────────────────────────────────────────────────
  { day: 'Kamis', timeSlot: '14:00', studentName: 'Rama',    instrument: 'G', mode: 'R', room: 1 },
  { day: 'Kamis', timeSlot: '15:00', studentName: 'Eden',    instrument: 'G', mode: 'R', room: 1 },
  { day: 'Kamis', timeSlot: '16:00', studentName: 'Alvin',   instrument: 'G', mode: 'R', room: 1 },
  { day: 'Kamis', timeSlot: '17:00', studentName: 'Avivah',  instrument: 'G', mode: 'O', room: 1 },
  { day: 'Kamis', timeSlot: '18:00', studentName: 'Vincent', instrument: 'G', mode: 'O', room: 1 },

  // ── JUMAT ─────────────────────────────────────────────────
  { day: 'Jumat', timeSlot: '08:00', studentName: 'Ko.Iyan', instrument: 'D', mode: 'R', room: 1 },
  { day: 'Jumat', timeSlot: '09:00', studentName: 'Setia',   instrument: 'G', mode: 'O', room: 1 },
  { day: 'Jumat', timeSlot: '13:00', studentName: 'Alisa',   instrument: 'D', mode: 'R', room: 1 },
  { day: 'Jumat', timeSlot: '13:00', studentName: 'Abdah',   instrument: 'G', mode: 'R', room: 2 },
  { day: 'Jumat', timeSlot: '14:00', studentName: 'Gideon',  instrument: 'D', mode: 'R', room: 1 },
  { day: 'Jumat', timeSlot: '14:00', studentName: 'B.Diah',  instrument: 'V', mode: 'R', room: 2 },
  { day: 'Jumat', timeSlot: '15:00', studentName: 'Fia',     instrument: 'V', mode: 'R', room: 1 },
  { day: 'Jumat', timeSlot: '16:00', studentName: 'Fadila',  instrument: 'K', mode: 'R', room: 1 },
  { day: 'Jumat', timeSlot: '16:00', studentName: 'Ayu',     instrument: 'V', mode: 'R', room: 2 },
  { day: 'Jumat', timeSlot: '17:00', studentName: 'Kikan',   instrument: 'K', mode: 'R', room: 1 },
  { day: 'Jumat', timeSlot: '18:00', studentName: 'Band',    instrument: 'G', mode: 'R', room: 1 },
  { day: 'Jumat', timeSlot: '19:00', studentName: 'Sean',    instrument: 'D', mode: 'R', room: 1 },

  // ── SABTU ─────────────────────────────────────────────────
  { day: 'Sabtu', timeSlot: '08:00', studentName: 'Mom Stey', instrument: 'K', mode: 'P', room: 1 },
  { day: 'Sabtu', timeSlot: '09:00', studentName: 'Inggit',   instrument: 'K', mode: 'R', room: 1 },
  { day: 'Sabtu', timeSlot: '10:00', studentName: 'Lib-Lib',  instrument: 'K', mode: 'R', room: 1 },
  { day: 'Sabtu', timeSlot: '11:00', studentName: 'Nabila',   instrument: 'K', mode: 'R', room: 1 },
  { day: 'Sabtu', timeSlot: '14:00', studentName: 'Fia',      instrument: 'V', mode: 'R', room: 1 },
  { day: 'Sabtu', timeSlot: '15:00', studentName: 'Elva',     instrument: 'V', mode: 'R', room: 1 },
  { day: 'Sabtu', timeSlot: '16:00', studentName: 'Zhea',     instrument: 'K', mode: 'R', room: 1 },
  { day: 'Sabtu', timeSlot: '16:00', studentName: 'Rava',     instrument: 'G', mode: 'R', room: 2 },
  { day: 'Sabtu', timeSlot: '17:00', studentName: 'Raya',     instrument: 'K', mode: 'P', room: 1 },

];

// ============================================================
// Fungsi insert satu record
// ============================================================
async function insertRecord(item) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HTTP ${res.status}: ${err}`);
  }
  return res.json();
}

// ============================================================
// Main: insert satu per satu dengan delay agar tidak throttle
// ============================================================
async function main() {
  console.log(`\n🎵 Import Jadwal TMS → Backendless`);
  console.log(`📋 Total entri: ${scheduleItems.length}\n`);

  let success = 0;
  let failed  = 0;

  for (const [i, item] of scheduleItems.entries()) {
    const label = `[${String(i+1).padStart(2,'0')}/${scheduleItems.length}] ${item.day} ${item.timeSlot} | Room ${item.room} | ${item.studentName}`;
    try {
      await insertRecord(item);
      console.log(`✅ ${label}`);
      success++;
    } catch (e) {
      console.error(`❌ ${label} → ${e.message}`);
      failed++;
    }
    // Delay kecil agar tidak kena rate-limit
    await new Promise(r => setTimeout(r, 120));
  }

  console.log(`\n─────────────────────────────────`);
  console.log(`✅ Berhasil : ${success}`);
  console.log(`❌ Gagal    : ${failed}`);
  console.log(`─────────────────────────────────\n`);
}

main().catch(console.error);
