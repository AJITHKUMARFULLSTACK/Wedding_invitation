import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

function FXCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let w = window.innerWidth;
    let h = window.innerHeight;
    let raf;

    const fit = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };
    fit();
    window.addEventListener("resize", fit);

    const stars = Array.from({ length: 70 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.5,
      a: Math.random(),
      v: Math.random() * 0.02 + 0.004
    }));

    const petals = Array.from({ length: 36 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      s: Math.random() * 9 + 7,
      vx: Math.random() - 0.5,
      vy: Math.random() * 1.2 + 0.8,
      rot: Math.random() * Math.PI,
      vr: Math.random() * 0.03 - 0.015
    }));

    const drawPetal = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.beginPath();
      ctx.moveTo(0, -p.s * 0.6);
      ctx.bezierCurveTo(p.s * 0.65, -p.s * 0.5, p.s * 0.6, p.s * 0.6, 0, p.s * 0.75);
      ctx.bezierCurveTo(-p.s * 0.6, p.s * 0.6, -p.s * 0.65, -p.s * 0.5, 0, -p.s * 0.6);
      const g = ctx.createLinearGradient(-p.s, -p.s, p.s, p.s);
      g.addColorStop(0, "rgba(245,220,232,.9)");
      g.addColorStop(1, "rgba(205,180,235,.7)");
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    };

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      stars.forEach((s) => {
        s.a += s.v;
        if (s.a > 1 || s.a < 0.15) s.v *= -1;
        ctx.fillStyle = `rgba(255,245,210,${s.a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      petals.forEach((p) => {
        p.x += p.vx + Math.sin(p.y * 0.012) * 0.3;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y > h + 20) {
          p.y = -10;
          p.x = Math.random() * w;
        }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        drawPetal(p);
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
    };
  }, []);

  return <canvas className="fx" ref={ref} />;
}

function App() {
  const [opening, setOpening] = useState(true);
  const [cursor, setCursor] = useState({ x: -50, y: -50 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const time = useCountdown("2026-05-13T10:30:00+05:30");
  const hangingFlowers = [
    { left: "8%", delay: 0, duration: 4.8, scale: 1 },
    { left: "22%", delay: 0.4, duration: 5.4, scale: 0.85 },
    { left: "50%", delay: 0.2, duration: 5, scale: 1.1 },
    { left: "74%", delay: 0.7, duration: 5.7, scale: 0.9 },
    { left: "90%", delay: 0.1, duration: 4.6, scale: 1 }
  ];
  const dancingFlowers = [
    { left: "12%", delay: 0.1, rotate: 8 },
    { left: "28%", delay: 0.6, rotate: -10 },
    { left: "73%", delay: 0.3, rotate: 12 },
    { left: "86%", delay: 0.8, rotate: -9 }
  ];

  useEffect(() => {
    const t = setTimeout(() => setOpening(false), 8000);
    return () => clearTimeout(t);
  }, []);

  const onMove = useCallback((e) => {
    setCursor({ x: e.clientX, y: e.clientY });
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      setOffset({
        x: (e.clientX / window.innerWidth - 0.5) * 18,
        y: (e.clientY / window.innerHeight - 0.5) * 14
      });
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [onMove]);

  return (
    <div className="relative overflow-x-hidden pb-20">
      <div className="cursor" style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }} />
      <FXCanvas />

      <div className="world-layer" style={{ transform: `translate(${offset.x * 4}px, ${offset.y * 3}px)` }}>
        <div className="moon" />
      </div>
      <div className="world-layer" style={{ transform: `translate(${offset.x * 2}px, ${offset.y * 2}px)` }}>
        <div className="minarets" />
        <div className="palace" />
      </div>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[3] h-64">
        {hangingFlowers.map((flower) => (
          <motion.div
            key={flower.left}
            className="absolute top-0 flex flex-col items-center"
            style={{ left: flower.left, transform: `scale(${flower.scale})` }}
            animate={{ y: [0, 10, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: flower.duration, repeat: Infinity, ease: "easeInOut", delay: flower.delay }}
          >
            <div className="h-20 w-px bg-gradient-to-b from-emerald-100/80 to-emerald-500/10" />
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-pink-200/45 bg-pink-200/20 text-2xl shadow-[0_0_18px_rgba(236,72,153,0.45)]">
              ❀
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {opening && (
          <motion.div className="opening" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
            <div>
              <motion.h1
                className="font-['Amiri'] text-3xl text-amber-100 sm:text-5xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </motion.h1>
              <motion.div
                className="names-glow mt-8 text-6xl leading-none sm:text-8xl md:text-9xl"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 4.8, duration: 2 }}
              >
                {DATA.names}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative z-10 mx-auto grid min-h-screen w-[92%] max-w-6xl place-content-center text-center">
        <motion.p
          className="font-['Amiri'] text-4xl text-amber-100 sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 7.8 }}
        >
          بِسْمِ اللَّهِ
        </motion.p>
        <motion.div
          className="names-glow mt-6 text-6xl leading-none sm:text-8xl md:text-[9rem]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 8, duration: 1.2 }}
        >
          {DATA.names}
        </motion.div>
        <p className="mx-auto mt-6 max-w-2xl text-sm uppercase tracking-[0.35em] text-amber-100/85 sm:text-base">
          You Are Invited To The Nikkah Ceremony
        </p>
      </section>

      <section className="relative z-10 mx-auto w-[92%] max-w-6xl py-16 sm:py-20">
        <h2 className="text-center font-['Playfair_Display'] text-4xl italic tracking-wide text-amber-100 sm:text-5xl">
          The Clock of Eternity
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-3 rounded-3xl border border-amber-200/25 bg-[#0f0a1f]/60 p-4 shadow-[0_0_50px_rgba(111,61,173,0.25)] backdrop-blur-xl sm:grid-cols-4 sm:gap-4 sm:p-6">
          {[
            ["Days", time.d],
            ["Hours", time.h],
            ["Minutes", time.m],
            ["Seconds", time.s]
          ].map(([label, value]) => (
            <div
              className="rounded-2xl border border-violet-200/25 bg-white/5 p-4 text-center shadow-inner shadow-violet-300/10"
              key={label}
            >
              <AnimatePresence mode="wait">
                <motion.strong
                  className="block font-['Playfair_Display'] text-3xl text-amber-100 sm:text-4xl"
                  key={value}
                  initial={{ rotateX: -80, opacity: 0 }}
                  animate={{ rotateX: 0, opacity: 1 }}
                  exit={{ rotateX: 80, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {String(value).padStart(2, "0")}
                </motion.strong>
              </AnimatePresence>
              <small className="mt-2 block text-xs uppercase tracking-[0.26em] text-violet-100/90">{label}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto grid w-[92%] max-w-6xl gap-5 py-16 sm:grid-cols-2 sm:py-20">
        <article className="overflow-hidden rounded-3xl border border-amber-200/30 bg-[#130d25]/65 p-6 backdrop-blur-xl">
          <h2 className="font-['Playfair_Display'] text-3xl italic text-amber-100 sm:text-4xl">Nikah Ceremony</h2>
          <p className="mt-4 text-lg text-amber-50/95"><strong className="text-amber-200">Date:</strong> {DATA.nikah.date}</p>
          <p className="mt-2 text-lg text-amber-50/95"><strong className="text-amber-200">Time:</strong> {DATA.nikah.time}</p>
          <p className="mt-2 text-lg text-amber-50/95"><strong className="text-amber-200">Venue:</strong> {DATA.nikah.venue}</p>
        </article>
        <article className="overflow-hidden rounded-3xl border border-violet-200/35 bg-[#17102a]/70 p-6 backdrop-blur-xl">
          <h2 className="font-['Playfair_Display'] text-3xl italic text-amber-100 sm:text-4xl">Walima Celebration</h2>
          <p className="mt-4 text-lg text-amber-50/95"><strong className="text-violet-200">Date:</strong> {DATA.walima.date}</p>
          <p className="mt-2 text-lg text-amber-50/95"><strong className="text-violet-200">Time:</strong> {DATA.walima.time}</p>
          <p className="mt-2 text-lg text-amber-50/95"><strong className="text-violet-200">Venue:</strong> {DATA.walima.venue}</p>
        </article>
      </section>
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[3] h-24">
        {dancingFlowers.map((flower) => (
          <motion.div
            key={flower.left}
            className="absolute bottom-0 text-4xl drop-shadow-[0_0_16px_rgba(250,204,21,0.4)] sm:text-5xl"
            style={{ left: flower.left }}
            animate={{ y: [0, -14, 0], rotate: [flower.rotate * -1, flower.rotate, flower.rotate * -1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: flower.delay }}
          >
            🌸
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default App;
