import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   DATA — SEMUA DARI FISHBONE
═══════════════════════════════════════════════════════════ */

const PUNCA_KATEGORI = [
  { id: 0, nama: "Kelemahan\nKawalan Politik", ikon: "🏛️", warna: "#10B981", gelap: "#065F46" },
  { id: 1, nama: "Ketidakpuasan\nterhadap Gabenor", ikon: "⚖️", warna: "#F59E0B", gelap: "#78350F" },
  { id: 2, nama: "Kumpulan\nPemberontak",     ikon: "⚔️", warna: "#EF4444", gelap: "#7F1D1D" },
  { id: 3, nama: "Fitnah &\nPropaganda",      ikon: "🕵️", warna: "#8B5CF6", gelap: "#4C1D95" },
];

// 8 kad clue — player kategorikan
const PUNCA_CLUES = [
  { teks: "Uthman enggan melawan sesama Islam walaupun dikepung",       kat: 0 },
  { teks: "Tiada pasukan pertahanan mencukupi di Madinah",              kat: 0 },
  { teks: "Sahabat senior berselisih faham dan berpisah ke wilayah",    kat: 0 },
  { teks: "Said bin al-As diusir oleh rakyat Kufah kerana ketidakpuasan", kat: 1 },
  { teks: "Tuduhan nepotisme — Uthman melantik Bani Umayyah ke jawatan penting", kat: 1 },
  { teks: "Pemberontak dari Mesir, Kufah dan Basrah mengepung Madinah", kat: 2 },
  { teks: "Qatirah dan Sudan antara pembunuh langsung Saidina Uthman",  kat: 2 },
  { teks: "Abdullah Ibn Saba' — bekas Yahudi dari Yaman menyebarkan hasutan", kat: 3 },
  { teks: "Surat-surat palsu diedarkan ke wilayah untuk menghasut rakyat", kat: 3 },
  { teks: "Uthman dikepung hampir 40 hari sebelum dibunuh",             kat: 2 },
];

// True / False — strategi Uthman
const STRATEGI_TF = [
  { penyataan: "Uthman berunding secara terbuka dan menghantar wakil ke setiap wilayah untuk mendengar aduan rakyat.", betul: true,  fakta: "Ini strategi rundingan yang diambil Uthman — beliau tidak mahu pertumpahan darah." },
  { penyataan: "Uthman memerintahkan tentera menyerang pemberontak yang mengepung rumahnya.",                          betul: false, fakta: "Salah. Uthman menolak dengan tegas sebarang tindakan kekerasan sesama Islam." },
  { penyataan: "Uthman menolak cadangan Ali dan sahabat yang ingin berperang mempertahankan beliau.",                   betul: true,  fakta: "Benar. Uthman berkata beliau tidak mahu menjadi orang pertama menumpahkan darah Islam." },
  { penyataan: "Uthman melarikan diri dari Madinah semasa dikepung oleh pemberontak.",                                 betul: false, fakta: "Salah. Uthman kekal di rumahnya, bersabar dan berdoa. Beliau tidak melarikan diri." },
  { penyataan: "Uthman berpuasa dan membaca Al-Quran pada hari terakhir hayatnya ketika dikepung.",                    betul: true,  fakta: "Benar. Ini menunjukkan ketenangan dan keteguhan iman Uthman sehingga ke saat syahid." },
  { penyataan: "Uthman meminta bantuan tentera Muawiyah dari Syria untuk menyerang pemberontak.",                      betul: false, fakta: "Salah. Uthman menolak bantuan ketenteraan kerana bimbang berlaku perang saudara dalam Islam." },
];

// Kad kesan — player sort ke Jangka Pendek atau Panjang
const KESAN_CARDS = [
  { teks: "Fitnah Kubra — era huru-hara dan kekecohan pertama dalam sejarah Islam", jenis: "pendek" },
  { teks: "Tercetusnya Perang Jamal (656M) antara Saidina Ali dan Saidatina Aisyah", jenis: "pendek" },
  { teks: "Tercetusnya Perang Siffin (657M) antara Saidina Ali dan Muawiyah",        jenis: "pendek" },
  { teks: "Kemunculan golongan Khawarij yang ekstrem dalam Islam",                   jenis: "pendek" },
  { teks: "Lahirnya perpecahan besar antara mazhab Sunni dan Syiah",                 jenis: "panjang" },
  { teks: "Sistem pemerintahan khalifah beralih kepada sistem monarki (Bani Umayyah)", jenis: "panjang" },
  { teks: "Uthman bin Affan diiktiraf sebagai syahid yang mulia dalam sejarah Islam", jenis: "panjang" },
  { teks: "Iktibar: Bahaya 'musuh dalam selimut' yang perlu sentiasa diwaspadai",    jenis: "panjang" },
];

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════ */
const GS = `
@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;margin:0;padding:0;}
button{cursor:pointer;border:none;font-family:'DM Sans',sans-serif;}
::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:#92400E;border-radius:2px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{0%{transform:scale(.6);opacity:0}75%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
@keyframes pulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:.9;transform:scale(1.04)}}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
@keyframes slideRight{from{transform:translateX(-40px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes wrongShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
@keyframes correctBounce{0%{transform:scale(1)}40%{transform:scale(1.1)}100%{transform:scale(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes bgMove{0%{background-position:0 0}100%{background-position:60px 60px}}
`;

/* ─── Geometric pattern SVG background ─── */
const PATTERN_BG = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23000000' stroke-opacity='0.04' stroke-width='1'%3E%3Cpolygon points='30,2 58,15 58,45 30,58 2,45 2,15'/%3E%3Cpolygon points='30,10 50,20 50,40 30,50 10,40 10,20'/%3E%3C/g%3E%3C/svg%3E")`;

const BG = `linear-gradient(160deg,#FFF8EE 0%,#FEF3E2 50%,#FDF0DC 100%)`;
const GOLD = "#B45309";
const GOLD_L = "#92400E";
const CARD_BG = "rgba(0,0,0,0.04)";
const CARD_BORDER = "rgba(0,0,0,0.1)";

/* ─── Wrapper ─── */
const W = ({ children, center = true }) => (
  <div style={{
    minHeight: "100vh", background: BG,
    backgroundImage: PATTERN_BG,
    animation: "bgMove 12s linear infinite",
    display: "flex", flexDirection: "column",
    alignItems: center ? "center" : "flex-start",
    justifyContent: center ? "center" : "flex-start",
    padding: "20px 16px 50px",
    fontFamily: "'DM Sans', sans-serif",
    overflowX: "hidden",
    color: "#1C1410",
  }}>
    <style>{GS}</style>
    {children}
  </div>
);

/* ─── Progress bar top ─── */
const ProgressBar = ({ step, total }) => (
  <div style={{ width: "100%", maxWidth: 440, marginBottom: 20 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
      {["⚔️ Punca", "🛡️ Strategi", "📜 Kesan"].map((l, i) => (
        <span key={i} style={{
          fontSize: 11, fontWeight: i + 1 <= step ? "700" : "400",
          color: i + 1 <= step ? GOLD_L : "rgba(255,255,255,0.25)",
          letterSpacing: 1,
        }}>{l}</span>
      ))}
    </div>
    <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ width: `${(step / total) * 100}%`, height: "100%",
        background: `linear-gradient(90deg,${GOLD},${GOLD_L})`,
        borderRadius: 3, transition: "width .5s ease",
        boxShadow: `0 0 10px ${GOLD}88` }} />
    </div>
  </div>
);

/* ─── Score pill ─── */
const ScorePill = ({ score }) => (
  <div style={{
    position: "fixed", top: 14, right: 14, zIndex: 99,
    background: `linear-gradient(135deg,${GOLD}22,${GOLD}08)`,
    border: `1px solid ${GOLD}55`,
    borderRadius: 30, padding: "6px 14px",
    display: "flex", alignItems: "center", gap: 6,
  }}>
    <span style={{ fontSize: 14 }}>⭐</span>
    <span style={{ fontSize: 14, fontWeight: 800, color: GOLD_L }}>{score}</span>
  </div>
);

/* ─── Big action button ─── */
const BigBtn = ({ onClick, children, color = GOLD, disabled = false }) => (
  <button onClick={onClick} disabled={disabled} style={{
    width: "100%", padding: "16px 20px", borderRadius: 16,
    background: disabled ? "rgba(255,255,255,0.06)"
      : `linear-gradient(135deg,${color},${color}BB)`,
    color: disabled ? "rgba(0,0,0,0.25)" : color === GOLD ? "#fff" : "#fff",
    fontSize: 15, fontWeight: 800, letterSpacing: 0.4,
    transition: "all .2s", boxShadow: disabled ? "none" : `0 4px 20px ${color}44`,
  }}>{children}</button>
);

/* ═══════════════════════════════════════════════════════════
   SCREENS
═══════════════════════════════════════════════════════════ */

/* ── WELCOME ── */
function ScreenWelcome({ onStart, name, setName }) {
  return (
    <W>
      <div style={{ maxWidth: 400, width: "100%", textAlign: "center", animation: "fadeUp .6s ease" }}>
        <div style={{ fontSize: 72, animation: "float 3s ease infinite", marginBottom: 8 }}>🔍</div>
        <div style={{ fontFamily: "'Amiri',serif", fontSize: 13, color: GOLD, letterSpacing: 4,
          textTransform: "uppercase", marginBottom: 8 }}>Penyiasat Sejarah Islam</div>
        <h1 style={{ fontFamily: "'Amiri',serif", fontSize: 32, color: "#1C1410", lineHeight: 1.3, marginBottom: 6 }}>
          Siasatan<br/><span style={{ color: GOLD }}>Syahid Uthman</span>
        </h1>
        <p style={{ fontSize: 13, color: "rgba(0,0,0,0.5)", lineHeight: 1.8, marginBottom: 24 }}>
          35 Hijrah • 656 Masihi<br/>
          Selesaikan 3 misi siasatan dan buktikan anda penyiasat sejarah terbaik!
        </p>

        {/* 3 misi preview */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
          {[["⚔️","Misi 1","Punca","#EF4444"],["🛡️","Misi 2","Strategi","#10B981"],["📜","Misi 3","Kesan","#8B5CF6"]].map(([ik,m,s,c])=>(
            <div key={m} style={{ background: c+"18", border: `1px solid ${c}33`,
              borderRadius: 14, padding: "12px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 26, marginBottom: 4 }}>{ik}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#1C1410", letterSpacing: 1 }}>{m}</div>
              <div style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", marginTop: 2 }}>{s}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(0,0,0,0.04)", border: `1px solid rgba(0,0,0,0.1)`, borderRadius: 18, padding: 20 }}>
          <p style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", marginBottom: 12 }}>Masukkan nama penyiasat</p>
          <input value={name} onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && name.trim() && onStart()}
            placeholder="Nama anda..."
            style={{ width: "100%", padding: "13px 16px", borderRadius: 12,
              border: `2px solid ${name.trim() ? GOLD : "rgba(0,0,0,0.15)"}`,
              background: "#fff", color: "#1C1410",
              fontSize: 14, marginBottom: 12, outline: "none",
              fontFamily: "'DM Sans',sans-serif", transition: "border .3s" }} />
          <BigBtn onClick={onStart} disabled={!name.trim()}>
            🔍 MULA SIASATAN!
          </BigBtn>
        </div>
      </div>
    </W>
  );
}

/* ── MISI 1 INTRO ── */
function ScreenM1Intro({ onStart }) {
  return (
    <W>
      <div style={{ maxWidth: 360, textAlign: "center", animation: "popIn .5s ease" }}>
        <div style={{ fontSize: 80, marginBottom: 10 }}>⚔️</div>
        <div style={{ display: "inline-block", background: "#EF4444", borderRadius: 8,
          padding: "4px 18px", marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: 3 }}>MISI 1 — PUNCA</span>
        </div>
        <h2 style={{ fontFamily: "'Amiri',serif", fontSize: 28, color: "#fff", marginBottom: 12 }}>
          Kenalpasti<br/><span style={{ color: "#FCA5A5" }}>Punca Kejadian</span>
        </h2>
        <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 14, padding: 18, marginBottom: 24, textAlign: "left" }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
            📋 <strong style={{ color: "#FCA5A5" }}>Arahan:</strong><br/>
            Setiap kad mengandungi satu clue tentang punca pembunuhan Uthman.<br/><br/>
            Kategorikan setiap clue ke dalam <strong style={{ color: "#fff" }}>4 kategori punca</strong> yang betul.<br/><br/>
            💰 <span style={{ color: "#FCD34D" }}>75 mata</span> setiap jawapan betul!
          </p>
        </div>
        <BigBtn onClick={onStart} color="#EF4444">MULA MISI 1 →</BigBtn>
      </div>
    </W>
  );
}

/* ── MISI 1 GAME ── */
function ScreenM1Game({ onDone }) {
  const shuffled = useRef([...PUNCA_CLUES].sort(() => Math.random() - 0.5)).current;
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [pts, setPts] = useState(0);
  const [anim, setAnim] = useState("");

  const current = shuffled[idx];

  const pick = (katId) => {
    if (revealed) return;
    setChosen(katId);
    setRevealed(true);
    const correct = katId === current.kat;
    setAnim(correct ? "correctBounce" : "wrongShake");
    if (correct) setPts(p => p + 75);
    setTimeout(() => {
      setAnim("");
      setRevealed(false);
      setChosen(null);
      if (idx + 1 >= shuffled.length) onDone(pts + (katId === current.kat ? 75 : 0));
      else setIdx(i => i + 1);
    }, 1800);
  };

  return (
    <W center={false}>
      <ScorePill score={pts} />
      <div style={{ width: "100%", maxWidth: 440, margin: "0 auto", paddingTop: 10 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", fontWeight: 600 }}>
            Kad {idx + 1} / {shuffled.length}
          </span>
          <span style={{ background: "#EF4444", borderRadius: 20, padding: "3px 14px",
            fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: 2 }}>MISI 1</span>
        </div>

        {/* Progress */}
        <div style={{ height: 5, background: "rgba(0,0,0,0.1)", borderRadius: 3, marginBottom: 20, overflow: "hidden" }}>
          <div style={{ width: `${((idx) / shuffled.length) * 100}%`, height: "100%",
            background: "linear-gradient(90deg,#EF4444,#FCA5A5)", borderRadius: 3, transition: "width .4s" }} />
        </div>

        {/* Clue card */}
        <div style={{ background: "rgba(239,68,68,0.08)", border: "2px solid rgba(239,68,68,0.35)",
          borderRadius: 18, padding: "24px 20px", marginBottom: 18, textAlign: "center",
          animation: `${anim || "fadeUp"} .4s ease`,
          boxShadow: "0 8px 30px rgba(239,68,68,0.1)" }}>
          <div style={{ fontSize: 11, color: "rgba(0,0,0,0.35)", letterSpacing: 3,
            textTransform: "uppercase", marginBottom: 12 }}>🔍 CLUE PENYIASAT</div>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#1C1410", lineHeight: 1.7 }}>
            "{current.teks}"
          </p>
        </div>

        {/* Question */}
        <p style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", textAlign: "center", marginBottom: 14 }}>
          Clue ini termasuk dalam kategori punca yang mana?
        </p>

        {/* 4 category buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {PUNCA_KATEGORI.map(k => {
            const isChosen = chosen === k.id;
            const isCorrect = k.id === current.kat;
            let bg = k.warna + "18", brd = k.warna + "55", textC = "#1C1410";
            if (revealed) {
              if (isCorrect) { bg = k.warna + "cc"; brd = k.warna; textC = "#fff"; }
              else if (isChosen) { bg = "#EF444466"; brd = "#EF4444"; textC = "#fff"; }
              else { bg = "rgba(0,0,0,0.04)"; brd = "rgba(0,0,0,0.08)"; textC = "rgba(0,0,0,0.3)"; }
            }
            return (
              <button key={k.id} onClick={() => pick(k.id)} disabled={revealed}
                style={{ padding: "14px 10px", borderRadius: 14, border: `2px solid ${brd}`,
                  background: bg, color: textC, transition: "all .25s",
                  transform: revealed && isCorrect ? "scale(1.04)" : "scale(1)" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{k.ikon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.35, whiteSpace: "pre-line" }}>
                  {k.nama}
                </div>
                {revealed && isCorrect && (
                  <div style={{ fontSize: 18, marginTop: 4 }}>✅</div>
                )}
                {revealed && isChosen && !isCorrect && (
                  <div style={{ fontSize: 18, marginTop: 4 }}>❌</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </W>
  );
}

/* ── MISI 1 DONE ── */
function ScreenM1Done({ pts, onNext }) {
  const max = PUNCA_CLUES.length * 75;
  return (
    <W>
      <div style={{ maxWidth: 360, textAlign: "center", animation: "popIn .5s ease" }}>
        <div style={{ fontSize: 64, marginBottom: 10 }}>⚔️</div>
        <h2 style={{ fontFamily: "'Amiri',serif", fontSize: 26, color: "#1C1410", marginBottom: 20 }}>Misi 1 Selesai!</h2>
        <div style={{ background: "rgba(239,68,68,0.08)", border: "2px solid rgba(239,68,68,0.3)",
          borderRadius: 18, padding: "24px", marginBottom: 24 }}>
          <div style={{ fontSize: 60, fontWeight: 900, color: "#EF4444", lineHeight: 1 }}>{pts}</div>
          <div style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", marginTop: 4 }}>daripada {max} mata</div>
          <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(0,0,0,0.04)",
            borderRadius: 10, textAlign: "left" }}>
            <p style={{ fontSize: 12, color: "rgba(0,0,0,0.7)", lineHeight: 1.8 }}>
              📚 <strong style={{ color: "#B91C1C" }}>Rumusan 4 Punca:</strong><br/>
              {PUNCA_KATEGORI.map(k => (
                <span key={k.id} style={{ display: "block", marginTop: 4 }}>
                  {k.ikon} {k.nama.replace("\n", " ")}
                </span>
              ))}
            </p>
          </div>
        </div>
        <BigBtn onClick={onNext} color="#10B981">KE MISI 2 — STRATEGI →</BigBtn>
      </div>
    </W>
  );
}

/* ── MISI 2 INTRO ── */
function ScreenM2Intro({ onStart }) {
  return (
    <W>
      <div style={{ maxWidth: 360, textAlign: "center", animation: "popIn .5s ease" }}>
        <div style={{ fontSize: 80, marginBottom: 10 }}>🛡️</div>
        <div style={{ display: "inline-block", background: "#10B981", borderRadius: 8,
          padding: "4px 18px", marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: 3 }}>MISI 2 — STRATEGI</span>
        </div>
        <h2 style={{ fontFamily: "'Amiri',serif", fontSize: 28, color: "#1C1410", marginBottom: 12 }}>
          Strategi<br/><span style={{ color: "#047857" }}>Khalifah Uthman</span>
        </h2>
        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)",
          borderRadius: 14, padding: 18, marginBottom: 24, textAlign: "left" }}>
          <p style={{ fontSize: 13, color: "rgba(0,0,0,0.65)", lineHeight: 1.8 }}>
            📋 <strong style={{ color: "#047857" }}>Arahan:</strong><br/>
            Baca setiap penyataan tentang strategi Uthman menghadapi krisis.<br/><br/>
            Tentukan sama ada penyataan itu <strong style={{ color: "#047857" }}>BENAR</strong> atau <strong style={{ color: "#B91C1C" }}>SALAH</strong>.<br/><br/>
            💰 <span style={{ color: GOLD }}>100 mata</span> setiap jawapan betul!
          </p>
        </div>
        <BigBtn onClick={onStart} color="#10B981">MULA MISI 2 →</BigBtn>
      </div>
    </W>
  );
}

/* ── MISI 2 GAME ── */
function ScreenM2Game({ onDone }) {
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [pts, setPts] = useState(0);

  const q = STRATEGI_TF[idx];

  const pick = (jawab) => {
    if (revealed) return;
    setChosen(jawab);
    setRevealed(true);
    if (jawab === q.betul) setPts(p => p + 100);
    setTimeout(() => {
      setRevealed(false); setChosen(null);
      if (idx + 1 >= STRATEGI_TF.length) onDone(pts + (jawab === q.betul ? 100 : 0));
      else setIdx(i => i + 1);
    }, 2200);
  };

  const isBenar = chosen === true, isSalah = chosen === false;

  return (
    <W center={false}>
      <ScorePill score={pts} />
      <div style={{ width: "100%", maxWidth: 440, margin: "0 auto", paddingTop: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", fontWeight: 600 }}>
            Soalan {idx + 1} / {STRATEGI_TF.length}
          </span>
          <span style={{ background: "#10B981", borderRadius: 20, padding: "3px 14px",
            fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: 2 }}>MISI 2</span>
        </div>

        <div style={{ height: 5, background: "rgba(0,0,0,0.1)", borderRadius: 3, marginBottom: 20, overflow: "hidden" }}>
          <div style={{ width: `${(idx / STRATEGI_TF.length) * 100}%`, height: "100%",
            background: "linear-gradient(90deg,#10B981,#6EE7B7)", borderRadius: 3, transition: "width .4s" }} />
        </div>

        {/* Penyataan */}
        <div style={{ background: "rgba(16,185,129,0.07)", border: "2px solid rgba(16,185,129,0.3)",
          borderRadius: 18, padding: "26px 20px", marginBottom: 20, textAlign: "center",
          animation: "fadeUp .4s ease" }}>
          <div style={{ fontSize: 11, color: "rgba(0,0,0,0.35)", letterSpacing: 3,
            textTransform: "uppercase", marginBottom: 14 }}>🛡️ PENYATAAN STRATEGI</div>
          <p style={{ fontSize: 15, fontWeight: 500, color: "#1C1410", lineHeight: 1.75 }}>
            {q.penyataan}
          </p>
        </div>

        {/* True / False buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          {[
            { label: "✅ BENAR", val: true,  c: "#10B981" },
            { label: "❌ SALAH", val: false, c: "#EF4444" },
          ].map(({ label, val, c }) => {
            const isThis = chosen === val;
            const correct = q.betul === val;
            let bg = c + "20", brd = c + "44";
            if (revealed) {
              if (correct) { bg = c + "bb"; brd = c; }
              else if (isThis) { bg = "rgba(100,100,100,0.3)"; brd = "rgba(255,255,255,0.15)"; }
              else { bg = "rgba(255,255,255,0.03)"; brd = "rgba(255,255,255,0.07)"; }
            }
            return (
              <button key={String(val)} onClick={() => pick(val)} disabled={revealed}
                style={{ padding: "22px 10px", borderRadius: 16, border: `2px solid ${brd}`,
                  background: bg, fontSize: 16, fontWeight: 800, color: "#fff",
                  transition: "all .25s", transform: revealed && correct ? "scale(1.05)" : "scale(1)",
                  boxShadow: !revealed ? `0 4px 14px ${c}22` : "none" }}>
                {label}
              </button>
            );
          })}
        </div>

        {/* Fakta reveal */}
        {revealed && (
          <div style={{ background: chosen === q.betul ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${chosen === q.betul ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.3)"}`,
            borderRadius: 12, padding: "14px 16px", animation: "fadeUp .3s ease" }}>
            <p style={{ fontSize: 12, color: "rgba(0,0,0,0.75)", lineHeight: 1.7 }}>
              {chosen === q.betul ? "✅" : "❌"} <strong>{chosen === q.betul ? "Betul!" : "Salah."}</strong>{" "}{q.fakta}
            </p>
          </div>
        )}
      </div>
    </W>
  );
}

/* ── MISI 2 DONE ── */
function ScreenM2Done({ pts, onNext }) {
  return (
    <W>
      <div style={{ maxWidth: 360, textAlign: "center", animation: "popIn .5s ease" }}>
        <div style={{ fontSize: 64, marginBottom: 10 }}>🛡️</div>
        <h2 style={{ fontFamily: "'Amiri',serif", fontSize: 26, color: "#1C1410", marginBottom: 20 }}>Misi 2 Selesai!</h2>
        <div style={{ background: "rgba(16,185,129,0.08)", border: "2px solid rgba(16,185,129,0.35)",
          borderRadius: 18, padding: "24px", marginBottom: 24 }}>
          <div style={{ fontSize: 60, fontWeight: 900, color: "#10B981", lineHeight: 1 }}>{pts}</div>
          <div style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", marginTop: 4 }}>daripada {STRATEGI_TF.length * 100} mata</div>
          <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(0,0,0,0.04)",
            borderRadius: 10, textAlign: "left" }}>
            <p style={{ fontSize: 12, color: "rgba(0,0,0,0.7)", lineHeight: 1.8 }}>
              📚 <strong style={{ color: "#047857" }}>2 Strategi Uthman:</strong><br/>
              🤝 Strategi Rundingan — hantar wakil, dengar aduan<br/>
              🕊️ Bersabar & Beriman — tolak kekerasan, teguh dalam iman
            </p>
          </div>
        </div>
        <BigBtn onClick={onNext} color="#8B5CF6">KE MISI 3 — KESAN →</BigBtn>
      </div>
    </W>
  );
}

/* ── MISI 3 INTRO ── */
function ScreenM3Intro({ onStart }) {
  return (
    <W>
      <div style={{ maxWidth: 360, textAlign: "center", animation: "popIn .5s ease" }}>
        <div style={{ fontSize: 80, marginBottom: 10 }}>📜</div>
        <div style={{ display: "inline-block", background: "#8B5CF6", borderRadius: 8,
          padding: "4px 18px", marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: 3 }}>MISI 3 — KESAN</span>
        </div>
        <h2 style={{ fontFamily: "'Amiri',serif", fontSize: 28, color: "#1C1410", marginBottom: 12 }}>
          Kesan<br/><span style={{ color: "#7C3AED" }}>Peristiwa Pembunuhan</span>
        </h2>
        <div style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.3)",
          borderRadius: 14, padding: 18, marginBottom: 24, textAlign: "left" }}>
          <p style={{ fontSize: 13, color: "rgba(0,0,0,0.65)", lineHeight: 1.8 }}>
            📋 <strong style={{ color: "#7C3AED" }}>Arahan:</strong><br/>
            Setiap kad adalah kesan pembunuhan Uthman.<br/><br/>
            Ketik kad dan letakkan ke dalam kategori:<br/>
            🟡 <strong>Kesan Jangka Pendek</strong> atau<br/>
            🟣 <strong>Kesan Jangka Panjang</strong><br/><br/>
            💰 <span style={{ color: GOLD }}>100 mata</span> setiap jawapan betul!
          </p>
        </div>
        <BigBtn onClick={onStart} color="#8B5CF6">MULA MISI 3 →</BigBtn>
      </div>
    </W>
  );
}

/* ── MISI 3 GAME ── */
function ScreenM3Game({ onDone }) {
  const shuffled = useRef([...KESAN_CARDS].sort(() => Math.random() - 0.5)).current;
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [pts, setPts] = useState(0);

  const current = shuffled[idx];

  const pick = (jenis) => {
    if (revealed) return;
    setChosen(jenis);
    setRevealed(true);
    const correct = jenis === current.jenis;
    if (correct) setPts(p => p + 100);
    setTimeout(() => {
      setRevealed(false); setChosen(null);
      if (idx + 1 >= shuffled.length) onDone(pts + (correct ? 100 : 0));
      else setIdx(i => i + 1);
    }, 2000);
  };

  return (
    <W center={false}>
      <ScorePill score={pts} />
      <div style={{ width: "100%", maxWidth: 440, margin: "0 auto", paddingTop: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", fontWeight: 600 }}>
            Kad {idx + 1} / {shuffled.length}
          </span>
          <span style={{ background: "#8B5CF6", borderRadius: 20, padding: "3px 14px",
            fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: 2 }}>MISI 3</span>
        </div>

        <div style={{ height: 5, background: "rgba(0,0,0,0.1)", borderRadius: 3, marginBottom: 20, overflow: "hidden" }}>
          <div style={{ width: `${(idx / shuffled.length) * 100}%`, height: "100%",
            background: "linear-gradient(90deg,#8B5CF6,#C4B5FD)", borderRadius: 3, transition: "width .4s" }} />
        </div>

        {/* Kesan card */}
        <div style={{ background: "rgba(139,92,246,0.07)", border: "2px solid rgba(139,92,246,0.3)",
          borderRadius: 18, padding: "26px 20px", marginBottom: 18, textAlign: "center",
          animation: "fadeUp .4s ease" }}>
          <div style={{ fontSize: 11, color: "rgba(0,0,0,0.35)", letterSpacing: 3,
            textTransform: "uppercase", marginBottom: 14 }}>📜 KESAN PERISTIWA</div>
          <p style={{ fontSize: 15, fontWeight: 500, color: "#1C1410", lineHeight: 1.75 }}>
            {current.teks}
          </p>
        </div>

        <p style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", textAlign: "center", marginBottom: 14 }}>
          Ini adalah kesan jenis apa?
        </p>

        {/* Two buckets */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { val: "pendek", label: "🟡 Jangka\nPENDEK", c: "#D97706", sub: "Berlaku terus\nselepas peristiwa" },
            { val: "panjang", label: "🟣 Jangka\nPANJANG", c: "#7C3AED", sub: "Kesan berpanjangan\nkepada Islam" },
          ].map(({ val, label, c, sub }) => {
            const isThis = chosen === val;
            const correct = current.jenis === val;
            let bg = c + "18", brd = c + "55", textC = "#1C1410";
            if (revealed) {
              if (correct) { bg = c + "cc"; brd = c; textC = "#fff"; }
              else if (isThis) { bg = "rgba(0,0,0,0.08)"; brd = "rgba(0,0,0,0.15)"; textC = "rgba(0,0,0,0.4)"; }
              else { bg = "rgba(0,0,0,0.03)"; brd = "rgba(0,0,0,0.08)"; textC = "rgba(0,0,0,0.3)"; }
            }
            return (
              <button key={val} onClick={() => pick(val)} disabled={revealed}
                style={{ padding: "20px 10px", borderRadius: 16, border: `2px solid ${brd}`,
                  background: bg, color: textC, transition: "all .25s",
                  transform: revealed && correct ? "scale(1.05)" : "scale(1)" }}>
                <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.4, whiteSpace: "pre-line", marginBottom: 6 }}>
                  {label}
                </div>
                <div style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", whiteSpace: "pre-line" }}>{sub}</div>
                {revealed && correct && <div style={{ fontSize: 20, marginTop: 8 }}>✅</div>}
                {revealed && isThis && !correct && <div style={{ fontSize: 20, marginTop: 8 }}>❌</div>}
              </button>
            );
          })}
        </div>

        {/* Result feedback */}
        {revealed && (
          <div style={{ marginTop: 12, padding: "12px 16px",
            background: chosen === current.jenis ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${chosen === current.jenis ? "rgba(16,185,129,0.35)" : "rgba(239,68,68,0.25)"}`,
            borderRadius: 12, animation: "fadeUp .3s ease" }}>
            <p style={{ fontSize: 12, color: "rgba(0,0,0,0.75)", lineHeight: 1.7 }}>
              {chosen === current.jenis
                ? `✅ Betul! Ini adalah kesan jangka ${current.jenis === "pendek" ? "pendek" : "panjang"}.`
                : `❌ Salah. Ini sebenarnya kesan jangka ${current.jenis === "pendek" ? "PENDEK" : "PANJANG"}.`}
            </p>
          </div>
        )}
      </div>
    </W>
  );
}

/* ── FINAL SCORE ── */
function ScreenFinal({ name, m1pts, m2pts, m3pts, onRestart }) {
  const total = m1pts + m2pts + m3pts;
  const maxTotal = (PUNCA_CLUES.length * 75) + (STRATEGI_TF.length * 100) + (KESAN_CARDS.length * 100);
  const pct = Math.round((total / maxTotal) * 100);

  const { darjah, msg, ikon } =
    pct >= 90 ? { darjah: "Penyiasat Lagenda ⭐⭐⭐", msg: "Luar biasa! Anda menguasai sepenuhnya sejarah Saidina Uthman.", ikon: "🏆" }
    : pct >= 70 ? { darjah: "Penyiasat Mahir ⭐⭐", msg: "Bagus! Anda memahami dengan baik peristiwa bersejarah ini.", ikon: "🥇" }
    : pct >= 50 ? { darjah: "Penyiasat Muda ⭐", msg: "Usaha yang baik! Ulang kaji lagi untuk pemahaman yang lebih kukuh.", ikon: "🥈" }
    : { darjah: "Penyiasat Baharu", msg: "Teruskan belajar! Sejarah ini penting untuk difahami.", ikon: "📖" };

  return (
    <W>
      <div style={{ maxWidth: 400, width: "100%", textAlign: "center", animation: "popIn .6s ease" }}>
        <div style={{ fontSize: 72, animation: "float 2.5s ease infinite", marginBottom: 10 }}>{ikon}</div>
        <div style={{ fontFamily: "'Amiri',serif", fontSize: 12, color: GOLD, letterSpacing: 3,
          textTransform: "uppercase", marginBottom: 6 }}>Laporan Penyiasat</div>
        <h2 style={{ fontFamily: "'Amiri',serif", fontSize: 26, color: "#1C1410", marginBottom: 4 }}>
          Tahniah, {name}!
        </h2>
        <p style={{ fontSize: 13, color: GOLD, fontWeight: 700, marginBottom: 20 }}>{darjah}</p>

        {/* Total score */}
        <div style={{ background: `linear-gradient(135deg,${GOLD}18,${GOLD}06)`,
          border: `2px solid ${GOLD}55`, borderRadius: 20, padding: "24px 20px", marginBottom: 18,
          boxShadow: `0 4px 24px ${GOLD}22` }}>
          <div style={{ fontSize: 72, fontWeight: 900, color: GOLD, lineHeight: 1 }}>{total}</div>
          <div style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", marginTop: 4 }}>
            daripada {maxTotal} mata ({pct}%)
          </div>
          {/* Breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 18,
            paddingTop: 14, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
            {[
              ["⚔️","Misi 1\nPunca", m1pts, "#DC2626", PUNCA_CLUES.length * 75],
              ["🛡️","Misi 2\nStrategi", m2pts, "#059669", STRATEGI_TF.length * 100],
              ["📜","Misi 3\nKesan", m3pts, "#7C3AED", KESAN_CARDS.length * 100],
            ].map(([ik,lb,val,c,mx])=>(
              <div key={lb}>
                <div style={{ fontSize: 22 }}>{ik}</div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 22, fontWeight: 900, color: c, lineHeight: 1.1 }}>{val}</div>
                <div style={{ fontSize: 9, color: "rgba(0,0,0,0.4)", whiteSpace: "pre-line" }}>{lb}</div>
                <div style={{ fontSize: 9, color: "rgba(0,0,0,0.3)" }}>/{mx}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Message */}
        <div style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: 14, padding: "14px 18px", marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: "rgba(0,0,0,0.65)", lineHeight: 1.7, fontStyle: "italic" }}>
            "{msg}"
          </p>
        </div>

        {/* Iktibar */}
        <div style={{ background: "rgba(180,83,9,0.08)", border: "1px solid rgba(180,83,9,0.25)",
          borderRadius: 14, padding: "14px 18px", marginBottom: 20 }}>
          <p style={{ fontSize: 12, color: "rgba(0,0,0,0.75)", lineHeight: 1.8 }}>
            📖 <strong style={{ color: GOLD }}>Iktibar Utama:</strong><br/>
            Pembunuhan Uthman mengajar kita bahaya <em>fitnah</em> dan <em>musuh dalam selimut</em>.
            Kesabaran dan keteguhan iman Uthman menjadikan beliau syahid yang mulia dalam sejarah Islam.
          </p>
        </div>

        <BigBtn onClick={onRestart} color={GOLD}>🔁 MAIN SEMULA</BigBtn>
      </div>
    </W>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP — STATE MACHINE
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [sc, setSc]     = useState("welcome");
  const [name, setName] = useState("");
  const [m1pts, setM1]  = useState(0);
  const [m2pts, setM2]  = useState(0);
  const [m3pts, setM3]  = useState(0);

  const reset = () => {
    setSc("welcome"); setName(""); setM1(0); setM2(0); setM3(0);
  };

  if (sc === "welcome")  return <ScreenWelcome onStart={() => setSc("m1_intro")} name={name} setName={setName} />;
  if (sc === "m1_intro") return <ScreenM1Intro onStart={() => setSc("m1_game")} />;
  if (sc === "m1_game")  return <ScreenM1Game  onDone={p => { setM1(p); setSc("m1_done"); }} />;
  if (sc === "m1_done")  return <ScreenM1Done  pts={m1pts} onNext={() => setSc("m2_intro")} />;
  if (sc === "m2_intro") return <ScreenM2Intro onStart={() => setSc("m2_game")} />;
  if (sc === "m2_game")  return <ScreenM2Game  onDone={p => { setM2(p); setSc("m2_done"); }} />;
  if (sc === "m2_done")  return <ScreenM2Done  pts={m2pts} onNext={() => setSc("m3_intro")} />;
  if (sc === "m3_intro") return <ScreenM3Intro onStart={() => setSc("m3_game")} />;
  if (sc === "m3_game")  return <ScreenM3Game  onDone={p => { setM3(p); setSc("final"); }} />;
  if (sc === "final")    return <ScreenFinal   name={name} m1pts={m1pts} m2pts={m2pts} m3pts={m3pts} onRestart={reset} />;
  return null;
}
