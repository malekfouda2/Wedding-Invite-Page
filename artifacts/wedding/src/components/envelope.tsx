import { useState } from "react";
import { motion } from "framer-motion";

export default function Envelope({ onOpen }: { onOpen: () => void }) {
  const [isFlapping, setIsFlapping] = useState(false);

  const handleClick = () => {
    setIsFlapping(true);
    setTimeout(() => {
      onOpen();
    }, 800); // Trigger page reveal after flap opens
  };

  return (
    <div className="relative w-full max-w-md aspect-[4/3] cursor-pointer group px-4" onClick={handleClick}>
      <motion.div 
        className="relative w-full h-full bg-[#F5F2EB] shadow-2xl rounded-sm overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Envelope back patterns */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Bottom flap */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#EBE7DF] origin-bottom transform skew-y-[10deg] border-t border-black/5" />
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-[#EBE7DF] origin-bottom transform -skew-y-[10deg] border-t border-black/5" />
          
          {/* Side flaps */}
          <div className="absolute top-0 left-0 w-1/2 h-full bg-[#F0EBE1] origin-left transform skew-x-[25deg] shadow-lg border-r border-black/5" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#F0EBE1] origin-right transform -skew-x-[25deg] shadow-lg border-l border-black/5" />
        </div>

        {/* Top Flap (Animated) */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-[60%] bg-[#FCFBF8] shadow-sm z-20 origin-top"
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          animate={isFlapping ? { rotateX: -180 } : { rotateX: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        />

        {/* Wax Seal */}
        <motion.div 
          className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
          animate={isFlapping ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-16 h-16 rounded-full bg-primary/90 shadow-[0_4px_10px_rgba(232,53,109,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] flex items-center justify-center border-2 border-primary-foreground/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
            <span className="text-primary-foreground text-2xl font-serif font-bold drop-shadow-md">ح & ي</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.p 
        className="text-center mt-8 text-muted-foreground font-serif italic tracking-wide"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Click to open your invitation
      </motion.p>
    </div>
  );
}
