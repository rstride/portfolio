import { motion } from "framer-motion";
import { Terminal as TerminalIcon } from "lucide-react";
import { useState, useEffect } from "react";

const commands = [
  { cmd: "whoami", output: "romain_stride // Senior Penetration Tester" },
  { cmd: "ls certs/", output: "OSCP.pdf  OSWE.pdf  CISSP.pdf  CRTP.pdf" },
  { cmd: "cat skills.txt", output: "Web App Sec, Network Pentesting, Cloud Security, Red Teaming" },
  { cmd: "nmap -sV target", output: "Port 80: Open [HTTP], Port 443: Open [HTTPS], Port 22: Open [SSH]" },
];

export function Terminal() {
  const [currentLine, setCurrentLine] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    if (currentLine >= commands.length) return;

    const fullText = commands[currentLine].cmd;
    let index = 0;

    const timer = setInterval(() => {
      setText(fullText.slice(0, index + 1));
      index++;

      if (index === fullText.length) {
        clearInterval(timer);
        setTimeout(() => {
          setCurrentLine((prev) => prev + 1);
          setText("");
        }, 2000);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [currentLine]);

  return (
    <div className="w-full max-w-2xl glass rounded-lg overflow-hidden shadow-2xl font-mono text-sm">
      <div className="bg-white/5 px-4 py-2 flex items-center gap-2 border-bottom border-border">
        <TerminalIcon size={14} className="text-accent" />
        <span className="text-xs text-zinc-500 uppercase tracking-widest">System Terminal</span>
        <div className="flex gap-1.5 ml-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
        </div>
      </div>
      <div className="p-6 min-h-[240px] bg-black/40">
        {commands.slice(0, currentLine).map((c, i) => (
          <div key={i} className="mb-4">
            <div className="flex gap-2">
              <span className="text-accent">➜</span>
              <span className="text-zinc-400">~</span>
              <span className="text-white">{c.cmd}</span>
            </div>
            <div className="text-zinc-500 mt-1 ml-6">{c.output}</div>
          </div>
        ))}
        {currentLine < commands.length && (
          <div className="flex gap-2">
            <span className="text-accent">➜</span>
            <span className="text-zinc-400">~</span>
            <span className="text-white">
              {text}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-accent ml-1 align-middle"
              />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
