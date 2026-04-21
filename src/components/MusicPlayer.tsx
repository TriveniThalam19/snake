import { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: '0x01A', title: 'SYNTH_PULSE_ERR', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '0x02B', title: 'CYBER_CITY_FRAG', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: '0x08C', title: 'GRID_RUNNER_MEM_LEAK', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? TRACKS.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const track = TRACKS[currentTrackIndex];

  return (
    <div className="flex flex-col p-4 lg:p-6 font-mono text-cyan-400 gap-6 h-full text-lg lg:text-xl">
      <div className="border-2 border-fuchsia-500 p-4 relative mt-2">
         <div className="absolute -top-4 left-4 bg-black px-2 text-fuchsia-500 text-lg">SIGNAL_LOCK</div>
         <p className="text-3xl lg:text-4xl text-glitch uppercase mt-2 mb-2 break-all leading-tight" data-text={track.title}>{track.title}</p>
         <p className="text-cyan-800">SECTOR: {track.id}</p>
      </div>

      <div className="flex-1 flex flex-col gap-3 mt-4">
         <div className="text-fuchsia-500 mb-2 border-b-2 border-fuchsia-900 pb-1 uppercase">BUFFER_QUEUE:</div>
         {TRACKS.map((t, idx) => (
           <div key={t.id} className={`flex justify-between items-center px-2 py-1 ${idx === currentTrackIndex ? 'text-cyan-400 bg-cyan-900/40 font-bold border-l-4 border-cyan-400' : 'text-cyan-800 border-l-4 border-transparent'}`}>
             <span className="truncate mr-4">{idx === currentTrackIndex ? '> ' : '  '}{t.title}</span>
             <span className="shrink-0">[{t.id}]</span>
           </div>
         ))}
      </div>

      <div className="mt-8 border-t-4 border-double border-cyan-800 pt-6 flex flex-col gap-6">
        <div className="flex justify-between w-full font-black text-3xl lg:text-4xl">
          <button onClick={handlePrev} className="hover:text-fuchsia-500 hover:bg-fuchsia-900/20 px-2 lg:px-4 border border-transparent hover:border-fuchsia-500 transition-none">[&lt;&lt;]</button>
          <button onClick={togglePlay} className="hover:text-fuchsia-500 hover:bg-fuchsia-900/20 px-2 lg:px-4 border border-transparent hover:border-fuchsia-500 transition-none text-glitch" data-text={isPlaying ? "[||]" : "[ >]"}>{isPlaying ? "[||]" : "[ >]"}</button>
          <button onClick={handleNext} className="hover:text-fuchsia-500 hover:bg-fuchsia-900/20 px-2 lg:px-4 border border-transparent hover:border-fuchsia-500 transition-none">[&gt;&gt;]</button>
        </div>
        
        <div className="flex justify-between items-center border border-cyan-800 p-2 text-xl">
          <span className="text-cyan-700">VOL_SYS</span>
          <button onClick={toggleMute} className={`px-4 py-1 uppercase font-bold transition-none border-2 border-transparent ${isMuted ? 'bg-fuchsia-600 text-black border-fuchsia-400' : 'bg-cyan-800 text-black hover:bg-cyan-400 hover:border-cyan-200'}`}>
            {isMuted ? 'MUTE_ON' : 'MUTE_OFF'}
          </button>
        </div>
      </div>

      <audio ref={audioRef} src={track.url} onEnded={handleNext} loop={false} />
    </div>
  );
}
