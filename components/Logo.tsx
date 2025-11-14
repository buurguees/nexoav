import { motion } from 'motion/react';

interface LogoProps {
  variant?: 'default' | 'icon';
  className?: string;
  animated?: boolean;
  animationSpeed?: 'slow' | 'normal' | 'fast';
}

export function Logo({ 
  variant = 'default', 
  className = '', 
  animated = false,
  animationSpeed = 'normal' 
}: LogoProps) {
  if (variant === 'icon') {
    return <LogoIcon className={className} animated={animated} animationSpeed={animationSpeed} />;
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <LogoIcon animated={animated} animationSpeed={animationSpeed} className="w-8 h-8" />
      {/* Texto solo visible en desktop */}
      <div className="hidden md:flex items-baseline gap-[0.15em]">
        <span className="text-xl tracking-[0.15em] font-light" style={{ color: 'var(--foreground)' }}>NEXO</span>
        <span className="text-xl tracking-[0.15em] font-extralight" style={{ color: 'var(--foreground-tertiary)' }}>AV</span>
      </div>
    </div>
  );
}

function LogoIcon({ 
  className, 
  animated,
  animationSpeed = 'normal' 
}: { 
  className?: string; 
  animated?: boolean;
  animationSpeed?: 'slow' | 'normal' | 'fast';
}) {
  if (!animated) {
    return (
      <svg
        className={className}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* TOP-LEFT - Más cerca del centro */}
        <path d="M 42 50 L 27 65 L 27 60 L 37 50 L 27 40 L 27 35 Z" fill="currentColor" />
        {/* TOP-RIGHT - Más cerca del centro */}
        <path d="M 50 42 L 35 27 L 40 27 L 50 37 L 60 27 L 65 27 Z" fill="currentColor" />
        {/* BOTTOM-RIGHT - Más cerca del centro */}
        <path d="M 58 50 L 73 35 L 73 40 L 63 50 L 73 60 L 73 65 Z" fill="currentColor" />
        {/* BOTTOM-LEFT - Más cerca del centro */}
        <path d="M 50 58 L 65 73 L 60 73 L 50 63 L 40 73 L 35 73 Z" fill="currentColor" />
      </svg>
    );
  }

  const durations = { slow: 3.5, normal: 2.8, fast: 2 };
  const duration = durations[animationSpeed];

  // Easing más natural y orgánico
  const naturalFlow = [0.33, 1, 0.68, 1]; // Suave inicio y final
  const dreamyEase = [0.19, 1, 0.22, 1]; // Ultra suave para efectos

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* Aura de fondo que respira */}
      <motion.circle
        cx="50"
        cy="50"
        r="45"
        fill="currentColor"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: [0, 0.04, 0.08, 0.06, 0.10, 0.04, 0],
          scale: [0.9, 0.95, 1, 1.05, 1.1, 1.15, 1.2],
        }}
        transition={{
          duration: duration * 1.3,
          ease: dreamyEase,
        }}
      />

      {/* TOP-LEFT CORNER - Emerge desde la nada */}
      <motion.path
        fill="currentColor"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.3, 0.7, 1] }}
        transition={{
          duration: duration * 0.7,
          ease: naturalFlow,
          times: [0, 0.2, 0.5, 0.8, 1],
        }}
      >
        <motion.animate
          attributeName="d"
          values="
            M 38 52 L 38 52 L 38 52 L 38 52 L 38 52 L 38 52 Z;
            M 39 51 L 30 60 L 30 57 L 35 51 L 30 45 L 30 43 Z;
            M 40 50.5 L 25 65 L 25 61 L 33 50 L 25 39 L 26 36 Z;
            M 41 50 L 22 68 L 22 64 L 34 50 L 22 36 L 23 33 Z;
            M 42 50 L 27 65 L 27 60 L 37 50 L 27 40 L 27 35 Z
          "
          dur={`${duration * 0.7}s`}
          keyTimes="0; 0.3; 0.6; 0.85; 1"
          keySplines="0.33 1 0.68 1; 0.33 1 0.68 1; 0.33 1 0.68 1; 0.33 1 0.68 1"
          calcMode="spline"
          fill="freeze"
        />
      </motion.path>

      {/* TOP-RIGHT CORNER - Desciende suavemente */}
      <motion.path
        fill="currentColor"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.3, 0.7, 1] }}
        transition={{
          duration: duration * 0.7,
          ease: naturalFlow,
          times: [0, 0.2, 0.5, 0.8, 1],
          delay: 0.12,
        }}
      >
        <motion.animate
          attributeName="d"
          values="
            M 52 38 L 52 38 L 52 38 L 52 38 L 52 38 L 52 38 Z;
            M 51 39 L 43 30 L 45 30 L 51 35 L 57 30 L 59 30 Z;
            M 50.5 40 L 36 25 L 39 25 L 50 33 L 61 25 L 64 26 Z;
            M 50 41 L 32 22 L 36 22 L 50 34 L 64 22 L 68 23 Z;
            M 50 42 L 35 27 L 40 27 L 50 37 L 60 27 L 65 27 Z
          "
          dur={`${duration * 0.7}s`}
          keyTimes="0; 0.3; 0.6; 0.85; 1"
          keySplines="0.33 1 0.68 1; 0.33 1 0.68 1; 0.33 1 0.68 1; 0.33 1 0.68 1"
          calcMode="spline"
          fill="freeze"
        />
      </motion.path>

      {/* BOTTOM-RIGHT CORNER - Fluye hacia dentro */}
      <motion.path
        fill="currentColor"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.3, 0.7, 1] }}
        transition={{
          duration: duration * 0.7,
          ease: naturalFlow,
          times: [0, 0.2, 0.5, 0.8, 1],
          delay: 0.24,
        }}
      >
        <motion.animate
          attributeName="d"
          values="
            M 62 48 L 62 48 L 62 48 L 62 48 L 62 48 L 62 48 Z;
            M 61 49 L 70 40 L 70 43 L 65 49 L 70 55 L 70 57 Z;
            M 60 49.5 L 75 35 L 75 39 L 67 50 L 75 61 L 74 64 Z;
            M 59 50 L 78 32 L 78 36 L 66 50 L 78 64 L 77 68 Z;
            M 58 50 L 73 35 L 73 40 L 63 50 L 73 60 L 73 65 Z
          "
          dur={`${duration * 0.7}s`}
          keyTimes="0; 0.3; 0.6; 0.85; 1"
          keySplines="0.33 1 0.68 1; 0.33 1 0.68 1; 0.33 1 0.68 1; 0.33 1 0.68 1"
          calcMode="spline"
          fill="freeze"
        />
      </motion.path>

      {/* BOTTOM-LEFT CORNER - Asciende etéreamente */}
      <motion.path
        fill="currentColor"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.3, 0.7, 1] }}
        transition={{
          duration: duration * 0.7,
          ease: naturalFlow,
          times: [0, 0.2, 0.5, 0.8, 1],
          delay: 0.36,
        }}
      >
        <motion.animate
          attributeName="d"
          values="
            M 48 62 L 48 62 L 48 62 L 48 62 L 48 62 L 48 62 Z;
            M 49 61 L 57 70 L 55 70 L 49 65 L 43 70 L 41 70 Z;
            M 49.5 60 L 64 75 L 61 75 L 50 67 L 39 75 L 36 74 Z;
            M 50 59 L 68 78 L 64 78 L 50 66 L 36 78 L 32 77 Z;
            M 50 58 L 65 73 L 60 73 L 50 63 L 40 73 L 35 73 Z
          "
          dur={`${duration * 0.7}s`}
          keyTimes="0; 0.3; 0.6; 0.85; 1"
          keySplines="0.33 1 0.68 1; 0.33 1 0.68 1; 0.33 1 0.68 1; 0.33 1 0.68 1"
          calcMode="spline"
          fill="freeze"
        />
      </motion.path>

      {/* Ondas expansivas suaves - como emociones que se propagan */}
      {[0, 0.25, 0.5, 0.75, 1].map((delay, i) => (
        <motion.circle
          key={`wave-${i}`}
          cx="50"
          cy="50"
          r="20"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 0.25, 0.15, 0],
            scale: [0.8, 1.2, 1.6, 2],
          }}
          transition={{
            duration: 2.5,
            ease: dreamyEase,
            delay: duration * 0.65 + delay * 0.15,
          }}
        />
      ))}

      {/* Partículas que flotan - memorias y momentos */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 15;
        const x = 50 + Math.cos(angle) * distance;
        const y = 50 + Math.sin(angle) * distance;
        
        return (
          <motion.circle
            key={`particle-${i}`}
            cx={x}
            cy={y}
            r="1.5"
            fill="currentColor"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.6, 0.8, 0.4, 0],
              scale: [0, 1.2, 1, 0.8, 0],
              x: Math.cos(angle) * 10,
              y: Math.sin(angle) * 10,
            }}
            transition={{
              duration: 2,
              ease: dreamyEase,
              delay: duration * 0.75 + i * 0.08,
            }}
          />
        );
      })}

      {/* Brillo central que emerge */}
      <motion.circle
        cx="50"
        cy="50"
        r="35"
        fill="currentColor"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{
          opacity: [0, 0.15, 0.25, 0.12, 0],
          scale: [0.7, 0.9, 1.2, 1.6, 2.2],
        }}
        transition={{
          duration: 2.2,
          ease: dreamyEase,
          delay: duration * 0.7,
        }}
      />

      {/* Resplandor final suave */}
      <motion.circle
        cx="50"
        cy="50"
        r="25"
        fill="currentColor"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0, 0.08, 0.15, 0.08, 0],
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          delay: duration * 0.85,
        }}
      />

      {/* Micro-movimiento final - como un latido */}
      <motion.g
        initial={{ scale: 1 }}
        animate={{ 
          scale: [1, 1.015, 0.995, 1],
        }}
        transition={{
          duration: 0.8,
          ease: naturalFlow,
          delay: duration * 0.95,
        }}
        style={{ transformOrigin: '50px 50px' }}
      >
        <rect x="0" y="0" width="100" height="100" fill="transparent" />
      </motion.g>
    </svg>
  );
}

export default function LogoDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950/10 to-slate-950 flex items-center justify-center p-8">
      <div className="space-y-20 max-w-5xl w-full">
        <div className="text-center space-y-12">
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          >
            <Logo 
              variant="default" 
              animated={true} 
              animationSpeed="normal"
              className="text-white scale-150"
            />
          </motion.div>
          
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <h1 className="text-6xl font-light text-white tracking-tight">
              Experiencias que <span className="font-semibold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">trascienden</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed font-light">
              Cada proyecto es un viaje emocional. Transformamos ideas en vivencias 
              que conectan, inspiran y permanecen.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          {[
            { speed: 'slow' as const, color: 'text-rose-400', label: 'Reflexiva', desc: 'Contemplación profunda' },
            { speed: 'normal' as const, color: 'text-cyan-400', label: 'Armónica', desc: 'Balance perfecto' },
            { speed: 'fast' as const, color: 'text-amber-400', label: 'Vibrante', desc: 'Energía pura' }
          ].map((variant, i) => (
            <motion.div
              key={variant.speed}
              className="flex flex-col items-center gap-6 p-10 rounded-3xl bg-gradient-to-b from-slate-900/40 to-slate-900/20 backdrop-blur-sm border border-slate-800/30 hover:border-slate-700/50 transition-all duration-700 hover:scale-105"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 + i * 0.2, ease: [0.19, 1, 0.22, 1] }}
            >
              <Logo 
                variant="icon" 
                animated={true} 
                animationSpeed={variant.speed}
                className={`w-24 h-24 ${variant.color}`}
              />
              <div className="text-center space-y-2">
                <span className="text-slate-100 text-lg font-medium">{variant.label}</span>
                <span className="text-slate-500 text-sm block">{variant.desc}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="flex justify-center pt-16 border-t border-slate-800/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.8 }}
        >
          <div className="flex flex-col items-center gap-5">
            <Logo 
              variant="icon" 
              animated={false}
              className="w-14 h-14 text-slate-700/50"
            />
            <span className="text-slate-600 text-xs tracking-widest uppercase">Sin animación</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}