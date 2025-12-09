import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Skull, AlertTriangle, Cross, Flame } from 'lucide-react';

// --- DATA: The 5 Key Scenes ---
const SCENES = [
  {
    id: 1,
    year: "Chapter 1",
    title: "The Defeat of Amalinze",
    type: "The Rise",
    chi: 95,
    icon: "muscle",
    color: "#eab308", // Yellow
    summary: "Okonkwo throws 'The Cat', a wrestler undefeated for seven years. This establishes his physical prowess and his desperate motivation: to be the opposite of his father.",
    analysis: "Critical Analysis: Okonkwo defines his identity purely through physical strength. This is not just ambition; it is fear. His entire character is built on the rejection of the 'feminine' traits he saw in Unoka. He rules his household with a heavy hand because he is terrified of being gentle.",
    quote: "'He had no patience with unsuccessful men. He had had no patience with his father.'"
  },
  {
    id: 2,
    year: "Chapter 7",
    title: "The Killing of Ikemefuna",
    type: "The Turning Point",
    chi: 60,
    icon: "skull",
    color: "#ef4444", // Red
    summary: "The Oracle decrees the boy Ikemefuna must die. Although warned by Ezeudu not to participate, Okonkwo delivers the killing blow himself.",
    analysis: "Critical Analysis: This is his 'Hamartia' (Tragic Flaw). He sacrifices his own humanity to preserve his reputation. He breaks the moral law of the clan (killing a 'son') to uphold his own rigid law of masculinity. It is the beginning of his psychological unraveling.",
    quote: "'Dazed with fear, Okonkwo drew his machete and cut him down. He was afraid of being thought weak.'"
  },
  {
    id: 3,
    year: "Chapter 13",
    title: "The Exile",
    type: "The Reversal",
    chi: 20,
    icon: "exile",
    color: "#f97316", // Orange
    summary: "At a funeral, Okonkwo's gun explodes and kills a boy. It is a 'female' (accidental) crime. He is exiled to his motherland for 7 years.",
    analysis: "Critical Analysis: The Irony is sharp. The symbol of his masculinity (the gun) malfunctions and forces him into the 'feminine' domain (Motherland). He is forced into passivity, which he loathes. He fails to learn the lesson that 'Mother is Supreme'—that tenderness has value.",
    quote: "'It was a crime against the earth goddess to kill a clansman... The only course open to Okonkwo was to flee.'"
  },
  {
    id: 4,
    year: "Chapter 16",
    title: "Nwoye's Conversion",
    type: "The Conflict",
    chi: 10,
    icon: "cross",
    color: "#3b82f6", // Blue
    summary: "Missionaries arrive in Mbanta. Nwoye, alienated by his father's harshness, is captivated by the hymns and joins the Christians.",
    analysis: "Critical Analysis: Okonkwo views this as the ultimate betrayal. He cannot understand Nwoye's need for gentleness. He interprets it as the 'Unoka' in him. Instead of self-reflection, Okonkwo responds with rage, choking his son. This pushes Nwoye away forever.",
    quote: "'Living fire begets cold, impotent ash.'"
  },
  {
    id: 5,
    year: "Chapter 25",
    title: "The Tragic End",
    type: "Catastrophe",
    chi: 0,
    icon: "rope",
    color: "#1f2937", // Grey/Black
    summary: "Realizing Umuofia will not go to war against the colonizers, Okonkwo hangs himself.",
    analysis: "Critical Analysis: Suicide is an abomination. By hanging himself, he ensures he cannot be buried by the clan he tried so hard to lead. He becomes a pariah. His tragedy is that his rigidity meant he would rather break than bend to the changing world.",
    quote: "'That man was one of the greatest men in Umuofia. You drove him to kill himself; and now he will be buried like a dog.'"
  }
];

// --- COMPONENT: Background Canvas (Embers) ---
const EmberBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 1 + 0.2;
        this.color = `rgba(255, ${Math.floor(Math.random() * 100 + 50)}, 0, ${Math.random() * 0.5})`;
      }
      update() {
        this.y -= this.speedY;
        if (this.y < 0) {
          this.y = canvas.height;
          this.x = Math.random() * canvas.width;
        }
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
      }
    };
    initParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 bg-stone-900" />;
};

// --- COMPONENT: Timeline Canvas ---
const TimelineCanvas = ({ activeId, onSelect }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Scale for high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const padding = 60;
    const width = rect.width;
    const height = rect.height;
    const lineY = height / 2;
    const spacing = (width - padding * 2) / (SCENES.length - 1);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Line
      ctx.beginPath();
      ctx.moveTo(padding, lineY);
      ctx.lineTo(width - padding, lineY);
      ctx.strokeStyle = '#57534e'; // stone-600
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw Nodes
      SCENES.forEach((scene, index) => {
        const x = padding + index * spacing;
        const isActive = scene.id === activeId;
        
        // Outer Glow for active
        if (isActive) {
          ctx.beginPath();
          ctx.arc(x, lineY, 25, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(234, 179, 8, 0.3)';
          ctx.fill();
        }

        // Circle
        ctx.beginPath();
        ctx.arc(x, lineY, isActive ? 12 : 8, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? scene.color : '#a8a29e';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        ctx.stroke();

        // Label
        ctx.fillStyle = isActive ? '#fff' : '#a8a29e';
        ctx.font = isActive ? 'bold 14px sans-serif' : '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(scene.year, x, lineY - 25);
      });
    };

    draw();

    // Click Handler
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      SCENES.forEach((scene, index) => {
        const x = padding + index * spacing;
        const dist = Math.sqrt((clickX - x) ** 2 + (clickY - lineY) ** 2);
        if (dist < 30) {
          onSelect(scene.id);
        }
      });
    };

    canvas.addEventListener('click', handleClick);
    return () => canvas.removeEventListener('click', handleClick);

  }, [activeId, onSelect]);

  return (
    <div className="w-full h-32 bg-stone-800/80 rounded-xl border border-stone-700 shadow-xl overflow-hidden mb-6">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

// --- COMPONENT: Main App ---
export default function OkonkwoApp() {
  const [activeId, setActiveId] = useState(1);
  const activeScene = SCENES.find(s => s.id === activeId);

  return (
    <div className="min-h-screen text-stone-100 font-serif relative overflow-hidden">
      <EmberBackground />

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-red-900/50 rounded-full mb-4 ring-2 ring-red-500/50">
            <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold mb-2 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
            THE ROARING FLAME
          </h1>
          <p className="text-stone-400 italic text-lg">
            A Critical Analysis of Okonkwo's Cycle of Fear in "Things Fall Apart"
          </p>
        </header>

        {/* Canvas Timeline */}
        <TimelineCanvas activeId={activeId} onSelect={setActiveId} />

        {/* Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Info Card */}
          <div className="md:col-span-2 bg-stone-800/90 backdrop-blur p-8 rounded-xl border border-stone-700 shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-3 mb-4 border-b border-stone-700 pb-4">
              <span className="text-sm font-sans uppercase tracking-widest text-orange-500">
                {activeScene.year}
              </span>
              <h2 className="text-3xl font-bold text-white">{activeScene.title}</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-stone-300 mb-2">Plot Summary</h3>
                <p className="text-stone-300 leading-relaxed font-sans text-sm">
                  {activeScene.summary}
                </p>
              </div>

              <div className="bg-stone-900/50 p-4 rounded-lg border-l-4 border-orange-500">
                <h3 className="text-lg font-bold text-orange-400 mb-2 flex items-center gap-2">
                  <BookOpen size={20} /> Analysis
                </h3>
                <p className="text-stone-300 italic leading-relaxed">
                  {activeScene.analysis}
                </p>
              </div>

              <div className="relative p-6 bg-black/40 rounded-lg mt-6">
                <div className="absolute -top-3 left-4 text-4xl text-stone-600">"</div>
                <p className="text-center text-xl text-stone-200 font-medium">
                  {activeScene.quote}
                </p>
                <div className="absolute -bottom-6 right-4 text-4xl text-stone-600">"</div>
              </div>
            </div>
          </div>

          {/* Sidebar / Stats */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Chi Meter */}
            <div className="bg-stone-800/90 backdrop-blur p-6 rounded-xl border border-stone-700 shadow-lg">
              <h3 className="text-stone-400 text-sm font-sans uppercase tracking-widest mb-4">
                Okonkwo's Chi (Strength)
              </h3>
              <div className="relative h-64 bg-stone-900 rounded-lg overflow-hidden flex flex-col justify-end border border-stone-700">
                 {/* Meter Gradient */}
                 <div 
                    className="w-full transition-all duration-700 ease-out"
                    style={{ 
                      height: `${activeScene.chi}%`,
                      backgroundColor: activeScene.color,
                      opacity: 0.8
                    }}
                 />
                 {/* Tick marks */}
                 <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between py-2 px-2">
                    <div className="w-full border-t border-white/10 text-[10px] text-right text-white/30">100%</div>
                    <div className="w-full border-t border-white/10 text-[10px] text-right text-white/30">50%</div>
                    <div className="w-full border-t border-white/10 text-[10px] text-right text-white/30">0%</div>
                 </div>
              </div>
              <p className="text-xs text-stone-500 mt-2 text-center font-sans">
                Status: {activeScene.chi > 80 ? "Dominant" : activeScene.chi > 30 ? "Conflicted" : "Broken"}
              </p>
            </div>

            {/* Type Card */}
            <div className="bg-stone-800/90 backdrop-blur p-6 rounded-xl border border-stone-700 shadow-lg flex flex-col items-center justify-center text-center">
               <div className="p-4 bg-stone-700 rounded-full mb-3 text-orange-400">
                  {activeScene.icon === 'skull' && <Skull size={32} />}
                  {activeScene.icon === 'muscle' && <Flame size={32} />}
                  {activeScene.icon === 'exile' && <AlertTriangle size={32} />}
                  {activeScene.icon === 'cross' && <Cross size={32} />}
                  {activeScene.icon === 'rope' && <div className="text-2xl font-bold">End</div>}
               </div>
               <div className="text-xl font-bold text-stone-200">{activeScene.type}</div>
               <p className="text-xs text-stone-500 mt-1 uppercase font-sans">Archetypal Stage</p>
            </div>

          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-12 text-center text-stone-500 text-sm font-sans">
          <p>Created for Honors ELA • Historical Analysis of Colonial Nigeria</p>
        </footer>
      </div>
    </div>
  );
}
