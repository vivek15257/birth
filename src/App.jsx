import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { 
  Award, 
  Heart, 
  Sparkles, 
  Calendar, 
  ChevronRight, 
  X, 
  Volume2, 
  VolumeX, 
  Lightbulb, 
  Flame, 
  Maximize2,
  Gift,
  Compass,
  ArrowRight
} from 'lucide-react'

// Web Audio API Synthesizer for elegant background piano melody
class AmbientSynth {
  constructor() {
    this.ctx = null
    this.isPlaying = false
    this.timer = null
    this.melodyIndex = 0
    this.chords = [
      // Beautiful ambient chord progression (Cmaj9 - Fmaj9 - G6 - Am9)
      { root: 60, notes: [60, 64, 67, 71, 74], melody: [76, 74, 71, 67, 71, 74] }, // C
      { root: 65, notes: [65, 69, 72, 76, 79], melody: [81, 79, 76, 72, 76, 79] }, // F
      { root: 67, notes: [67, 71, 74, 77, 81], melody: [83, 81, 77, 74, 77, 81] }, // G
      { root: 57, notes: [57, 60, 64, 67, 71], melody: [72, 71, 67, 64, 67, 71] }  // Am
    ]
    this.chordIndex = 0
  }

  start() {
    if (this.isPlaying) return
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    this.ctx = new AudioContext()
    this.isPlaying = true
    this.scheduler()
  }

  stop() {
    this.isPlaying = false
    if (this.timer) clearTimeout(this.timer)
    if (this.ctx) {
      this.ctx.close()
      this.ctx = null
    }
  }

  playNote(midiNote, time, duration, volume = 0.1, type = 'sine') {
    if (!this.ctx) return
    const freq = Math.pow(2, (midiNote - 69) / 12) * 440
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    osc.type = type
    osc.frequency.setValueAtTime(freq, time)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1000, time)
    filter.frequency.exponentialRampToValueAtTime(300, time + duration)

    gain.gain.setValueAtTime(0, time)
    gain.gain.linearRampToValueAtTime(volume, time + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(time)
    osc.stop(time + duration)
  }

  scheduler() {
    if (!this.isPlaying || !this.ctx) return

    const now = this.ctx.currentTime
    const chord = this.chords[this.chordIndex]

    // Play soft backing pads
    chord.notes.forEach((note, idx) => {
      this.playNote(note - 12, now, 4.0, 0.02, 'sine') // Base pads
    })

    // Play sparkling melody notes
    const delayStep = 0.6
    chord.melody.forEach((note, idx) => {
      const noteTime = now + idx * delayStep
      const length = idx === chord.melody.length - 1 ? 1.5 : 0.8
      const isGoldNote = idx % 2 === 0
      this.playNote(note, noteTime, length, 0.04, isGoldNote ? 'triangle' : 'sine')
    })

    this.chordIndex = (this.chordIndex + 1) % this.chords.length
    // Schedule next chord in 4.5 seconds
    this.timer = setTimeout(() => this.scheduler(), 4500)
  }
}

// Interactive Constellation & Cosmic Auroral Network Background
const ParticleBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let particles = []
    const mouse = {
      x: null,
      y: null,
      radius: 160
    }
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.baseSize = this.size
        this.speedX = Math.random() * 0.3 - 0.15
        this.speedY = Math.random() * 0.3 - 0.15
        this.color = Math.random() > 0.4 ? 'rgba(221, 160, 21, 0.5)' : 'rgba(139, 92, 246, 0.5)'
        this.wobble = Math.random() * Math.PI * 2
        this.wobbleSpeed = Math.random() * 0.03 + 0.01
      }

      update() {
        // Normal drift
        this.x += this.speedX
        this.y += this.speedY
        this.wobble += this.wobbleSpeed

        // Screen boundary wrapping
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY

        // Mouse interaction (gravity effect)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x
          const dy = mouse.y - this.y
          const distance = Math.hypot(dx, dy)
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius
            this.x -= dx * force * 0.02
            this.y -= dy * force * 0.02
            this.size = this.baseSize + force * 2.5
          } else {
            if (this.size > this.baseSize) {
              this.size -= 0.1
            }
          }
        }
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        // Twinkling stars effect
        const pulse = Math.abs(Math.sin(this.wobble)) * 0.4 + 0.6
        ctx.fillStyle = this.color.replace('0.5', (0.5 * pulse).toString())
        ctx.shadowBlur = this.size * 3
        ctx.shadowColor = this.color
        ctx.fill()
      }
    }

    const init = () => {
      resizeCanvas()
      particles = []
      const density = 12000 // area per particle
      const count = Math.min(120, Math.floor((canvas.width * canvas.height) / density))
      for (let i = 0; i < count; i++) {
        particles.push(new Particle())
      }
    }

    const drawLines = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x
          const dy = particles[a].y - particles[b].y
          const distance = Math.hypot(dx, dy)

          if (distance < 110) {
            const alpha = (1 - distance / 110) * 0.18
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }

        // Draw line to mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[a].x - mouse.x
          const dy = particles[a].y - mouse.y
          const distance = Math.hypot(dx, dy)

          if (distance < mouse.radius) {
            const alpha = (1 - distance / mouse.radius) * 0.25
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(mouse.x, mouse.y)
            // Gold line for mouse connection
            ctx.strokeStyle = `rgba(221, 160, 21, ${alpha})`
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.shadowBlur = 0
      
      particles.forEach(p => {
        p.update()
        p.draw()
      })
      
      drawLines()
      animationFrameId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouse.x = null
      mouse.y = null
    }

    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    
    init()
    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
}

export default function App() {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false)
  const [isCakeLit, setIsCakeLit] = useState(true)
  const [activeImage, setActiveImage] = useState(null)
  const [wishRevealed, setWishRevealed] = useState(false)
  const synthRef = useRef(null)

  // Initialize synthesized audio
  useEffect(() => {
    synthRef.current = new AmbientSynth()
    // Trigger initial confetti
    triggerPremiumConfetti()

    return () => {
      if (synthRef.current) {
        synthRef.current.stop()
      }
    }
  }, [])

  const toggleMusic = () => {
    if (!synthRef.current) return
    if (isPlayingMusic) {
      synthRef.current.stop()
      setIsPlayingMusic(false)
    } else {
      synthRef.current.start()
      setIsPlayingMusic(true)
    }
  }

  const triggerPremiumConfetti = () => {
    // Elegant luxury gold and royal blue confetti burst
    const end = Date.now() + 1.2 * 1000
    const colors = ['#ffe072', '#dda015', '#c4b5fd', '#8b5cf6', '#ffffff']

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors
      })
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }

  const handleCakeClick = () => {
    setIsCakeLit(!isCakeLit)
    if (isCakeLit) {
      // Confetti burst on blowing out candles
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffe072', '#dda015', '#c4b5fd', '#8b5cf6', '#ffffff']
      })
    }
  }

  // Gallery Images List using real photos
  const galleryImages = [
    {
      src: '/images/shravani_1.jpg',
      title: 'Joyful Moments',
      desc: 'Radiant smiles and beautiful memories captured together.'
    },
    {
      src: '/images/shravani_2.jpg',
      title: 'Out and About',
      desc: 'Exploring new places and sharing wonderful days.'
    },
    {
      src: '/images/shravani_3.jpg',
      title: 'The Best Company',
      desc: 'Fun times surrounded by friends who inspire and bring out the best in us.'
    },
    {
      src: '/images/shravani_4.jpg',
      title: 'Shared Journeys',
      desc: 'Every moment shared is a reminder of how lucky we are to have you.'
    }
  ]

  // Timeline points
  const timelinePoints = [
    {
      year: 'Lesson 1',
      title: 'Leading by Example',
      desc: 'Showing us that true leadership isn\'t about authority, but about guiding, empowering, and lifting those around you.',
      icon: Compass
    },
    {
      year: 'Lesson 2',
      title: 'The Power of Resilience',
      desc: 'Demonstrating how to meet challenges with grace, learn from failure, and move forward with unbroken conviction.',
      icon: Flame
    },
    {
      year: 'Lesson 3',
      title: 'Generosity of Spirit',
      desc: 'Proving that kindness and understanding are powerful forces. Your ability to listen and support has made all the difference.',
      icon: Heart
    },
    {
      year: 'Lesson 4',
      title: 'Continuous Growth',
      desc: 'Inspiring us to keep learning, stay curious, and strive to be better professionals and human beings each day.',
      icon: Sparkles
    }
  ]

  return (
    <div className="relative min-height-screen text-slate-100 font-sans selection:bg-gold-500/30 selection:text-gold-200">
      {/* Background visual elements */}
      <ParticleBackground />

      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-0 left-1/4 w-[35rem] h-[35rem] bg-rose-700/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-10 w-[30rem] h-[30rem] bg-gold-700/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-10 w-[40rem] h-[40rem] bg-rose-800/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Elegant Fixed Header / Controls */}
      <header className="sticky top-0 z-40 w-full px-6 py-4 flex items-center justify-between backdrop-blur-md border-b border-white/5 bg-[#03001e]/30">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-gold-400 animate-pulse" />
          <span className="font-display font-semibold tracking-wider text-sm uppercase text-gradient-gold">
            Inspiration
          </span>
        </div>
        <button
          onClick={toggleMusic}
          className="flex items-center space-x-2 px-4 py-2 rounded-full glass-panel border border-gold-500/20 text-xs font-semibold text-gold-300 hover:text-gold-100 hover:border-gold-400/50 transition-all duration-300 shadow-md cursor-pointer"
        >
          {isPlayingMusic ? (
            <>
              <Volume2 className="w-4 h-4 text-gold-400 animate-bounce" />
              <span>Ambient Piano On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" />
              <span>Play Ambient Piano</span>
            </>
          )}
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24 md:space-y-36 relative z-10">
        
        {/* 1. HERO SECTION */}
        <section className="min-h-[80vh] flex flex-col justify-center items-center text-center relative pt-8 pb-16">
          
          {/* Animated floating balloons (custom SVG graphics) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              animate={{ y: [-10, -50, -10], x: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
              className="absolute left-[10%] top-[20%] w-12 h-16 bg-gradient-to-b from-gold-300 to-gold-600 rounded-t-full rounded-b-3xl opacity-20 filter blur-[1px] glow-gold" 
            />
            <motion.div 
              animate={{ y: [-20, -70, -20], x: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 1 }}
              className="absolute right-[12%] top-[15%] w-16 h-20 bg-gradient-to-b from-rose-400 to-rose-700 rounded-t-full rounded-b-3xl opacity-20 filter blur-[1px] glow-rose" 
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-6 max-w-4xl"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border border-gold-500/10 text-gold-300 text-xs font-semibold tracking-wide uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Celebrating a Special Friendship</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-bold tracking-tight">
              <span className="block text-slate-100">Happy Birthday</span>
              <span className="block mt-2 text-gradient-gold font-display font-extrabold pb-3">
                Shravani 🎉
              </span>
            </h1>

            <p className="text-lg sm:text-2xl text-slate-300 font-light max-w-2xl mx-auto tracking-wide">
              "To an Incredible Friend Who Inspires Me Every Day"
            </p>
          </motion.div>

          {/* Interactive Birthday Cake Illustration */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 relative cursor-pointer group select-none"
            onClick={handleCakeClick}
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-gold-500/10 to-rose-500/10 rounded-full filter blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Interactive SVG Cake */}
            <svg width="240" height="260" viewBox="0 0 240 260" className="mx-auto transform transition-transform duration-500 group-hover:scale-105">
              {/* Flames */}
              <AnimatePresence>
                {isCakeLit && (
                  <>
                    {/* Flame 1 */}
                    <motion.path 
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.2, 0.9, 1.1, 1], y: [0, -3, 1, -2, 0] }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      d="M100 60 C95 45 105 35 105 25 C105 35 115 45 110 60 Z" 
                      fill="url(#flameGrad)" 
                      className="origin-bottom filter drop-shadow-[0_0_8px_rgba(255,165,0,0.8)]"
                    />
                    {/* Flame 2 */}
                    <motion.path 
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.1, 1.2, 0.9, 1], y: [0, -2, 2, -1, 0] }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1.3, delay: 0.1 }}
                      d="M110 52 C105 37 115 27 115 17 C115 27 125 37 120 52 Z" 
                      fill="url(#flameGrad)" 
                      className="origin-bottom filter drop-shadow-[0_0_9px_rgba(255,165,0,0.85)]"
                    />
                    {/* Flame 3 (Middle) */}
                    <motion.path 
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.15, 0.85, 1.1, 1], y: [0, -2, 1, -3, 0] }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1.6, delay: 0.2 }}
                      d="M120 45 C115 30 125 20 125 10 C125 20 135 30 130 45 Z" 
                      fill="url(#flameGrad)" 
                      className="origin-bottom filter drop-shadow-[0_0_10px_rgba(255,165,0,0.9)]"
                    />
                    {/* Flame 4 */}
                    <motion.path 
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.2, 0.9, 1.1, 1], y: [0, -1, -2, 1, 0] }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1.4, delay: 0.3 }}
                      d="M130 52 C125 37 135 27 135 17 C135 27 145 37 140 52 Z" 
                      fill="url(#flameGrad)" 
                      className="origin-bottom filter drop-shadow-[0_0_9px_rgba(255,165,0,0.85)]"
                    />
                    {/* Flame 5 */}
                    <motion.path 
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.1, 0.8, 1.15, 1], y: [0, -3, 2, -1, 0] }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1.7, delay: 0.4 }}
                      d="M140 60 C135 45 145 35 145 25 C145 35 155 45 150 60 Z" 
                      fill="url(#flameGrad)" 
                      className="origin-bottom filter drop-shadow-[0_0_8px_rgba(255,165,0,0.8)]"
                    />
                  </>
                )}
              </AnimatePresence>

              {/* Candles */}
              <g fill="#f8fafc">
                <rect x="98" y="60" width="4" height="25" rx="2" fill="#ffe072" />
                <rect x="108" y="52" width="4" height="33" rx="2" fill="#ffe072" />
                <rect x="118" y="45" width="4" height="40" rx="2" fill="#ffe072" />
                <rect x="128" y="52" width="4" height="33" rx="2" fill="#ffe072" />
                <rect x="138" y="60" width="4" height="25" rx="2" fill="#ffe072" />
              </g>

              {/* Cake Stand & Base */}
              <ellipse cx="120" cy="235" rx="100" ry="15" fill="rgba(255,255,255,0.08)" stroke="rgba(221,160,21,0.3)" strokeWidth="2" />
              <path d="M80 235 L90 252 L150 252 L160 235 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(221,160,21,0.2)" strokeWidth="1" />

              {/* Tier 1: Bottom Layer */}
              <rect x="30" y="180" width="180" height="55" rx="8" fill="url(#cakeBlueDark)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <ellipse cx="120" cy="180" rx="90" ry="15" fill="url(#goldGrad)" />
              <path d="M30 185 C52 202, 75 202, 98 185 C120 173, 142 202, 165 185 C187 173, 198 191, 210 185 L210 180 L30 180 Z" fill="url(#goldGrad)" />

              {/* Tier 2: Middle Layer */}
              <rect x="55" y="130" width="130" height="50" rx="8" fill="url(#cakeBlueMedium)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <ellipse cx="120" cy="130" rx="65" ry="12" fill="url(#goldGrad)" />
              <path d="M55 135 C70 148, 90 148, 105 135 C120 128, 135 148, 150 135 C165 128, 175 140, 185 135 L185 130 L55 130 Z" fill="url(#goldGrad)" />

              {/* Tier 3: Top Layer */}
              <rect x="80" y="85" width="80" height="45" rx="8" fill="url(#cakeBlue)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <ellipse cx="120" cy="85" rx="40" ry="10" fill="url(#goldGrad)" />
              {/* Dripping frosting effect */}
              <path d="M80 90 C90 98, 100 98, 110 90 C120 86, 130 98, 140 90 C150 86, 155 94, 160 90 L160 85 L80 85 Z" fill="url(#goldGrad)" />

              {/* Definitions */}
              <defs>
                <linearGradient id="flameGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="60%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fef08a" />
                </linearGradient>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffe072" />
                  <stop offset="100%" stopColor="#b97a0e" />
                </linearGradient>
                <linearGradient id="cakeBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#2e1065" />
                </linearGradient>
                <linearGradient id="cakeBlueMedium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6d28d9" />
                  <stop offset="100%" stopColor="#1c0542" />
                </linearGradient>
                <linearGradient id="cakeBlueDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4c1d95" />
                  <stop offset="100%" stopColor="#080119" />
                </linearGradient>
              </defs>
            </svg>

            <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-gold-300 transition-colors duration-300">
              {isCakeLit ? 'Click cake to blow out candles' : 'Click to light candles'}
            </div>
          </motion.div>

          <div className="mt-12">
            <button
              onClick={triggerPremiumConfetti}
              className="px-6 py-3 rounded-full bg-gradient-gold text-slate-950 font-bold hover:shadow-[0_0_25px_rgba(221,160,21,0.5)] transform hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center space-x-2 cursor-pointer"
            >
              <Gift className="w-5 h-5 text-slate-950" />
              <span>Celebrate with Confetti!</span>
            </button>
          </div>
        </section>

        {/* 2. GRATITUDE SECTION */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden glow-gold">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <div className="p-3 bg-gold-500/10 rounded-full border border-gold-500/20">
                <Heart className="w-8 h-8 text-gold-400 fill-gold-400/20" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gradient-gold">
                A Message of Deep Gratitude
              </h2>
              <blockquote className="text-lg sm:text-2xl text-slate-200 font-light leading-relaxed max-w-3xl italic">
                "Your dedication, wisdom, and positive attitude have inspired me in countless ways. Thank you for being a guiding light and motivating me to become a better version of myself."
              </blockquote>
            </div>
          </div>
        </motion.section>

        {/* 3. WHY YOU INSPIRE ME */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-serif font-bold text-slate-100">
              Why You Inspire Me
            </h2>
            <div className="w-16 h-1 bg-gradient-gold mx-auto rounded-full" />
            <p className="text-slate-400 max-w-xl mx-auto">
              Reflecting on the outstanding qualities that define your leadership and impact on everyone around you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Leadership Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="glass-panel rounded-2xl p-8 border border-white/5 flex flex-col space-y-4 hover:border-gold-500/30 transition-all duration-300 glow-rose/10 hover:shadow-[0_8px_30px_rgb(221,160,21,0.05)]"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-100">Leadership</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Leading not by command, but by example. You inspire confidence and guide others with absolute integrity, showing us how to achieve greatness together.
              </p>
            </motion.div>

            {/* Hard Work Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="glass-panel rounded-2xl p-8 border border-white/5 flex flex-col space-y-4 hover:border-gold-500/30 transition-all duration-300 glow-rose/10 hover:shadow-[0_8px_30px_rgb(221,160,21,0.05)]"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-100">Hard Work</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your strong work ethic, relentless dedication, and focus serve as a daily blueprint for diligence. You prove that excellence is a habit, not a coincidence.
              </p>
            </motion.div>

            {/* Kindness Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="glass-panel rounded-2xl p-8 border border-white/5 flex flex-col space-y-4 hover:border-gold-500/30 transition-all duration-300 glow-rose/10 hover:shadow-[0_8px_30px_rgb(221,160,21,0.05)]"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-100">Kindness</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Beyond accomplishments, your kindness, positive attitude, and willing empathy create a welcoming atmosphere where everyone feels seen, respected, and motivated.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 4. APPRECIATION TIMELINE */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-serif font-bold text-slate-100">
              Appreciation Timeline
            </h2>
            <div className="w-16 h-1 bg-gradient-gold mx-auto rounded-full" />
            <p className="text-slate-400 max-w-xl mx-auto">
              Looking back at the key developmental highlights and wisdom shared on this journey together.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto py-8">
            {/* Timeline Line */}
            <div className="absolute left-[24px] md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-[2px] timeline-line pointer-events-none" />

            <div className="space-y-12">
              {timelinePoints.map((point, index) => {
                const isEven = index % 2 === 0;
                const IconComponent = point.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className={`relative flex items-center justify-between w-full group ${isEven ? 'md:flex-row-reverse' : ''}`}
                  >
                    {/* Empty block for layout alignment */}
                    <div className="hidden md:block w-5/12" />

                    {/* Timeline Node Icon */}
                    <div className="absolute left-[24px] md:static transform -translate-x-1/2 md:translate-x-0 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-[#1b0f38] border-2 border-gold-500/80 shadow-[0_0_15px_rgba(221,160,21,0.4)] transition-all duration-500 group-hover:scale-125 group-hover:border-gold-400 group-hover:shadow-[0_0_25px_rgba(221,160,21,0.8)]">
                      <IconComponent className="w-5 h-5 text-gold-400 group-hover:text-gold-200 transition-colors duration-300" />
                    </div>

                    {/* Content Panel */}
                    <motion.div 
                      whileHover={{ scale: 1.03, y: -4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-full pl-[60px] md:pl-0 md:w-5/12"
                    >
                      <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-lg hover:border-gold-500/30 hover:shadow-[0_8px_30px_rgba(221,160,21,0.15)] transition-all duration-300 cursor-default">
                        <span className="inline-block text-xs font-bold tracking-widest text-gold-400 uppercase mb-2">
                          {point.year}
                        </span>
                        <h3 className="text-xl font-bold font-display text-slate-100 mb-2">{point.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{point.desc}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. BIRTHDAY WISHES */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative glass-panel rounded-3xl p-8 sm:p-12 overflow-hidden border border-gold-500/20 shadow-2xl">
            <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-gold-500/10 to-rose-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-600/10 rounded-full blur-2xl" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <span className="text-3xl">🎁</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gradient-gold">
                My Sincere Birthday Wishes
              </h2>
              
              <AnimatePresence mode="wait">
                {!wishRevealed ? (
                  <motion.div
                    key="unrevealed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-6 flex flex-col items-center space-y-4"
                  >
                    <p className="text-slate-300 font-light text-base tracking-wide max-w-md">
                      I have written a special, heartfelt blessing for your upcoming year. Click below to open it.
                    </p>
                    <button
                      onClick={() => {
                        setWishRevealed(true);
                        triggerPremiumConfetti();
                      }}
                      className="px-6 py-2.5 rounded-full border border-gold-500/40 text-gold-300 font-semibold text-sm hover:bg-gold-500/10 hover:border-gold-400 transition-all duration-300 shadow-md flex items-center space-x-2 cursor-pointer"
                    >
                      <span>Reveal Wishes</span>
                      <ArrowRight className="w-4 h-4 text-gold-400" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.p
                    key="revealed"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl sm:text-2xl text-slate-200 font-light leading-relaxed max-w-3xl font-serif"
                  >
                    "May this year bring you endless happiness, success, good health, and countless reasons to smile. You deserve every wonderful thing life has to offer."
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        {/* 6. MEMORY GALLERY */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-serif font-bold text-slate-100">
              Inspirational Gallery
            </h2>
            <div className="w-16 h-1 bg-gradient-gold mx-auto rounded-full" />
            <p className="text-slate-400 max-w-xl mx-auto">
              A premium visual collection of metaphors representing guidance, wisdom, and cosmic achievements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl glass-panel border border-white/5 aspect-square"
                onClick={() => setActiveImage(img)}
              >
                {/* Image */}
                <img 
                  src={img.src} 
                  alt={img.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h4 className="text-lg font-bold text-gold-300 flex items-center space-x-1">
                    <span>{img.title}</span>
                    <Maximize2 className="w-4 h-4 text-gold-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </h4>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed line-clamp-2">
                    {img.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 7. FINAL TRIBUTE SECTION */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center py-12 relative"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-5 select-none pointer-events-none">
            <span className="font-serif text-[12rem] font-bold text-gold-500">“</span>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <p className="text-2xl sm:text-4xl font-serif text-slate-100 italic leading-relaxed font-light">
              "Some people make the world better simply by being in it. Thank you for being one of those people."
            </p>
            <div className="w-12 h-[1px] bg-gold-400/40 mx-auto" />
            <p className="text-xs uppercase tracking-widest text-gold-400 font-bold font-display">
              A Heartfelt Tribute
            </p>
          </div>
        </motion.section>

      </main>

      {/* 8. FOOTER */}
      <footer className="border-t border-white/5 py-12 text-center bg-[#020208]/80 backdrop-blur-md relative z-10 mt-24">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div className="flex justify-center items-center space-x-2">
            <span className="text-slate-400 text-sm">With Gratitude</span>
            <motion.div
              animate={{ scale: [1, 1.25, 1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </motion.div>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Tribute Website. Built with love, appreciation, and premium craftsmanship.
          </p>
        </div>
      </footer>

      {/* Lightbox Modal overlay */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => setActiveImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative max-w-3xl w-full glass-panel-heavy rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors duration-300 z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Lightbox Content */}
              <div className="flex flex-col md:flex-row">
                <div className="md:w-3/5 bg-slate-950 flex items-center justify-center">
                  <img
                    src={activeImage.src}
                    alt={activeImage.title}
                    className="max-h-[60vh] object-contain"
                  />
                </div>
                <div className="md:w-2/5 p-8 flex flex-col justify-center space-y-4 bg-slate-950/80">
                  <div className="inline-flex text-xs font-bold tracking-widest text-gold-400 uppercase">
                    Gallery Feature
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-slate-100">
                    {activeImage.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {activeImage.desc}
                  </p>
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-xs text-slate-500 italic">
                      A visual representation of wisdom, kindness, and inspiration.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
