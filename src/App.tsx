import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono relative overflow-hidden flex crt-flicker bg-grid">
      <div className="static-noise"></div>
      <div className="scanlines"></div>
      
      <div className="relative z-10 w-full h-[100dvh] overflow-y-auto overflow-x-hidden p-4 lg:p-10 flex flex-col glitch-tear">
        <header className="border-b-4 border-fuchsia-600 pb-4 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-5xl lg:text-7xl font-black text-glitch text-cyan-400 m-0 leading-none" data-text="SYS.SNAKE_V1.0">
              SYS.SNAKE_V1.0
            </h1>
            <p className="text-fuchsia-500 mt-2 text-xl md:text-2xl">[ PROTOCOL // GLITCH_ART_ACTIVE ]</p>
          </div>
          <div className="md:text-right text-lg">
            <div className="text-cyan-700">KERNEL_READY</div>
            <div className="text-fuchsia-500 border border-fuchsia-500 px-2 mt-1 animate-pulse inline-block">REC_SIGNAL...</div>
          </div>
        </header>

        <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-10">
          <aside className="col-span-1 lg:col-span-4 flex flex-col border-4 border-cyan-500 bg-black shadow-[8px_8px_0_#f0f] relative z-20">
            <div className="bg-cyan-500 text-black px-4 py-2 font-black text-xl lg:text-2xl mb-4">
              AUDIO_SUBSYSTEM
            </div>
            <MusicPlayer />
          </aside>

          <main className="col-span-1 lg:col-span-8 flex flex-col border-4 border-fuchsia-500 bg-black shadow-[-8px_8px_0_#0ff] relative z-20">
             <div className="bg-fuchsia-500 text-black px-4 py-2 font-black text-xl lg:text-2xl flex justify-between">
              <span>EXEC://SNAKE.EXE</span>
              <span className="animate-ping">_</span>
            </div>
            <div className="flex-1 p-4 lg:p-8 relative flex justify-center items-center overflow-hidden">
              <SnakeGame />
            </div>
          </main>
        </div>
        
        <footer className="mt-auto border-t-2 border-dashed border-cyan-800 pt-4 pb-8 text-cyan-800 text-center text-lg lg:text-xl">
          SYSTEM_CYCLE: {new Date().getTime().toString(16).toUpperCase()} // END_OF_LINE
        </footer>
      </div>
    </div>
  );
}
