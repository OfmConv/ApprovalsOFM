import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Loading({ className, style }: LoadingProps) {
  return (
    <>
      <style>{`
        @keyframes simpleFade {
          0%, 100% { opacity: 0.2; }
          50%      { opacity: 1; }
        }
      `}</style>

      <div
        className={cn("flex flex-col items-center justify-center gap-4", className)}
        style={style}
        role="status"
        aria-label="Loading"
      >
        <div>
          <img src="/Logo_ordo1.png"
          alt="Logo Ordo"
          className="w-[120px] h-[120px] object-contain shadow-none"
          style={{
            animation: "simpleFade 1.5s ease-in-out infinite",
          }}
        />
        </div>
        <div className="text-xs font-mono tracking-[0.25em] uppercase text-gray-500 shadow-none" style={{
            animation: "simpleFade 1.5s ease-in-out 0.2s infinite",
          }}
        ><strong className="text-sm">Ordo Saudara Dina Konventual(OFMConv.)</strong></div>
         
        
        <span
          aria-hidden="true"
          className="text-xs font-mono tracking-[0.25em] uppercase text-gray-500 shadow-none"
          style={{
            animation: "simpleFade 1.5s ease-in-out 0.2s infinite",
          }}
        >
          loading...
        </span>
      </div>
    </>
  );
}