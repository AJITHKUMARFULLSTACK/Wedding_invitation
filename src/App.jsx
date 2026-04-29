import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import cherryBlossomLeft from "./cherry blossom (1).gif";
import cherryBlossomRight from "./cherry blossom.gif";

const DATA = {
  names: "Imran & Yamina",
  nikah: {
    date: "May 13, Wednesday",
    time: "10.30 AM",
    venue: "Shri Sharadhamaba Grand, Ilanji"
  },
  walima: {
    date: "May 14, Thursday",
    time: "11.30 AM",
    venue: "Rose Mahal Marriage Hall, Ti"
  }
};

function useCountdown(targetIso) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date(targetIso);
    const run = () => {
      const diff = Math.max(0, target - new Date());
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000)
      });
    };
    run();
    const timer = setInterval(run, 1000);
    return () => clearInterval(timer);
  }, [targetIso]);
  return time;
}

function WisteriaStrand({ left, sway = 5, delay = 0, scale = 1 }) {
  return (
    <motion.div
      className="absolute top-0"
      style={{ left, scale }}
      animate={{ rotate: [-2, 2, -2], y: [0, 8, 0] }}
      transition={{ duration: sway, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <svg width="120" height="300" viewBox="0 0 120 300" aria-hidden="true">
        <defs>
          <linearGradient id="stem" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7a8f6a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7a8f6a" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="petalA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d8b4fe" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <filter id="waterBlur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.8" />
          </filter>
        </defs>
        <path d="M60 0 C62 80, 62 160, 56 250" stroke="url(#stem)" strokeWidth="2" fill="none" />
        {[...Array(14)].map((_, idx) => (
          <g key={idx} transform={`translate(${58 + Math.sin(idx) * 12}, ${62 + idx * 15})`} filter="url(#waterBlur)">
            <ellipse cx="0" cy="0" rx="11" ry="7" fill="url(#petalA)" opacity={0.65 - idx * 0.02} />
            <ellipse cx="-6" cy="4" rx="9" ry="6" fill="#f5d0fe" opacity={0.5 - idx * 0.015} />
          </g>
        ))}
      </svg>
    </motion.div>
  );
}

function App() {
  const [opening, setOpening] = useState(true);
  const time = useCountdown("2026-05-13T10:30:00+05:30");
  const strands = [
    { left: "1%", sway: 6.4, delay: 0.1, scale: 1.1 },
    { left: "8%", sway: 5.4, delay: 0.5, scale: 0.95 },
    { left: "16%", sway: 6, delay: 0.2, scale: 1 },
    { left: "79%", sway: 5.8, delay: 0.4, scale: 1 },
    { left: "87%", sway: 6.2, delay: 0.7, scale: 1.08 },
    { left: "94%", sway: 5.2, delay: 0.2, scale: 0.9 }
  ];
  const floatingPetals = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    left: `${6 + i * 6.7}%`,
    duration: 8 + (i % 6) * 1.1,
    delay: i * 0.22
  })), []);

  useEffect(() => {
    const t = setTimeout(() => setOpening(false), 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="invitation-page relative overflow-x-hidden pb-18">
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <filter id="watercolorTexture">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0.1" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.06" />
          </feComponentTransfer>
        </filter>
      </svg>

      <div className="watercolor-overlay" />
      <div className="soft-bokeh" />
      <motion.img
        src={cherryBlossomLeft}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-14 -top-12 z-[5] w-[320px] max-w-[44vw] opacity-55 mix-blend-multiply"
        animate={{ y: [0, 8, 0], rotate: [-1.5, 1.5, -1.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src={cherryBlossomRight}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-8 z-[5] w-[320px] max-w-[44vw] scale-x-[-1] opacity-50 mix-blend-multiply"
        animate={{ y: [0, 10, 0], rotate: [1.8, -1.2, 1.8] }}
        transition={{ duration: 8.6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[4] h-80">
        {strands.map((strand) => (
          <WisteriaStrand key={strand.left} {...strand} />
        ))}
      </div>

      <div className="pointer-events-none fixed inset-0 z-[3]">
        {floatingPetals.map((petal) => (
          <motion.div
            key={petal.left}
            className="absolute -top-10"
            style={{ left: petal.left }}
            animate={{ y: ["-6vh", "110vh"], x: [0, 18, -22, 10, -6], rotate: [0, 80, 170, 260] }}
            transition={{ duration: petal.duration, repeat: Infinity, ease: "linear", delay: petal.delay }}
          >
            <svg width="16" height="14" viewBox="0 0 24 20" aria-hidden="true">
              <defs>
                <linearGradient id="driftPetal" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fbcfe8" />
                  <stop offset="100%" stopColor="#f9a8d4" />
                </linearGradient>
                <filter id="petalBlur">
                  <feGaussianBlur stdDeviation="0.8" />
                </filter>
              </defs>
              <path d="M12 2 C18 2, 22 8, 12 18 C2 8, 6 2, 12 2 Z" fill="url(#driftPetal)" opacity="0.58" filter="url(#petalBlur)" />
            </svg>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {opening && (
          <motion.div className="opening" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            <div>
              <motion.h1
                className="font-['Amiri'] text-3xl text-violet-800 sm:text-5xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </motion.h1>
              <motion.div
                className="names-glow mt-6 text-6xl leading-none sm:text-8xl md:text-9xl"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2, duration: 1.8 }}
              >
                {DATA.names}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.section
        className="relative z-10 mx-auto grid min-h-[88vh] w-[92%] max-w-4xl place-content-center text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.35, once: false }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <motion.p
          className="font-['Amiri'] text-3xl text-violet-800 sm:text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.4 }}
        >
          بِسْمِ اللَّهِ
        </motion.p>
        <motion.div
          className="names-glow mt-5 text-6xl leading-none sm:text-8xl md:text-[8.5rem]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3.6, duration: 1.2 }}
        >
          {DATA.names}
        </motion.div>
        <p className="mx-auto mt-6 max-w-2xl text-xs uppercase tracking-[0.35em] text-violet-700/85 sm:text-sm">
          You Are Invited To The Nikkah Ceremony
        </p>
        <div className="mx-auto mt-10 flex w-full max-w-2xl items-center justify-center gap-4 text-violet-700">
          <div className="h-px flex-1 bg-violet-400/55" />
          <div className="text-5xl font-semibold leading-none text-violet-700">13</div>
          <div className="h-px flex-1 bg-violet-400/55" />
        </div>
      </motion.section>

      <motion.section
        className="relative z-10 mx-auto w-[92%] max-w-5xl py-10 sm:py-14"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.3, once: false }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-center font-['Playfair_Display'] text-3xl italic tracking-wide text-violet-900 sm:text-4xl">
          The Clock of Eternity
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-3 rounded-3xl border border-violet-300/35 bg-white/55 p-4 shadow-[0_12px_40px_rgba(168,85,247,0.12)] backdrop-blur-md sm:grid-cols-4 sm:gap-4 sm:p-6">
          {[
            ["Days", time.d],
            ["Hours", time.h],
            ["Minutes", time.m],
            ["Seconds", time.s]
          ].map(([label, value]) => (
            <div
              className="rounded-2xl border border-violet-300/35 bg-violet-50/70 p-4 text-center shadow-inner shadow-violet-300/15"
              key={label}
            >
              <AnimatePresence mode="wait">
                <motion.strong
                  className="block font-['Playfair_Display'] text-3xl text-violet-800 sm:text-4xl"
                  key={value}
                  initial={{ rotateX: -80, opacity: 0 }}
                  animate={{ rotateX: 0, opacity: 1 }}
                  exit={{ rotateX: 80, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {String(value).padStart(2, "0")}
                </motion.strong>
              </AnimatePresence>
              <small className="mt-2 block text-xs uppercase tracking-[0.26em] text-violet-600/90">{label}</small>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="relative z-10 mx-auto grid w-[92%] max-w-5xl gap-5 py-10 sm:grid-cols-2 sm:py-14"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.25, once: false }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <article className="overflow-hidden rounded-3xl border border-violet-300/40 bg-white/60 p-6 backdrop-blur-md">
          <h2 className="font-['Playfair_Display'] text-3xl italic text-violet-900 sm:text-4xl">Nikah Ceremony</h2>
          <p className="mt-4 text-lg text-violet-800/95"><strong className="text-violet-600">Date:</strong> {DATA.nikah.date}</p>
          <p className="mt-2 text-lg text-violet-800/95"><strong className="text-violet-600">Time:</strong> {DATA.nikah.time}</p>
          <p className="mt-2 text-lg text-violet-800/95"><strong className="text-violet-600">Venue:</strong> {DATA.nikah.venue}</p>
        </article>
        <article className="overflow-hidden rounded-3xl border border-fuchsia-300/45 bg-[#fff7fc]/70 p-6 backdrop-blur-md">
          <h2 className="font-['Playfair_Display'] text-3xl italic text-violet-900 sm:text-4xl">Walima Celebration</h2>
          <p className="mt-4 text-lg text-violet-800/95"><strong className="text-fuchsia-500">Date:</strong> {DATA.walima.date}</p>
          <p className="mt-2 text-lg text-violet-800/95"><strong className="text-fuchsia-500">Time:</strong> {DATA.walima.time}</p>
          <p className="mt-2 text-lg text-violet-800/95"><strong className="text-fuchsia-500">Venue:</strong> {DATA.walima.venue}</p>
        </article>
      </motion.section>
      <div className="pointer-events-none absolute inset-x-0 bottom-2 z-[4] h-16">
        {["8%", "16%", "26%", "74%", "84%", "92%"].map((left, idx) => (
          <motion.div
            key={left}
            className="absolute bottom-0 text-3xl text-pink-400/80 drop-shadow-[0_0_8px_rgba(244,114,182,0.35)] sm:text-4xl"
            style={{ left }}
            animate={{ y: [0, -6, 0], rotate: [-6, 6, -6] }}
            transition={{ duration: 3.2 + idx * 0.2, repeat: Infinity, ease: "easeInOut", delay: idx * 0.18 }}
          >
            🌸
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default App;
