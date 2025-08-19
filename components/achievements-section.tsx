"use client";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";
import { 
  Trophy, 
  Target, 
  Shield, 
  Award, 
  TrendingUp, 
  Users, 
  Calendar,
  Star,
  Zap,
  Bug,
  Lock,
  CheckCircle
} from "lucide-react";

const achievements = [
  {
    id: 1,
    title: "CVEs Published",
    value: 12,
    suffix: "+",
    icon: Bug,
    description: "Critical vulnerabilities disclosed",
    color: "from-red-500 to-orange-500",
    highlight: true
  },
  {
    id: 2,
    title: "Bug Bounty Rewards",
    value: 80,
    suffix: "+",
    icon: Trophy,
    description: "Critical findings validated",
    color: "from-yellow-500 to-orange-500",
    highlight: true
  },
  {
    id: 3,
    title: "Hall of Fame",
    value: 10,
    suffix: "+",
    icon: Star,
    description: "Major platforms recognition",
    color: "from-blue-500 to-purple-500",
    highlight: false
  },
  {
    id: 4,
    title: "Years Experience",
    value: 8,
    suffix: "",
    icon: Calendar,
    description: "Professional cybersecurity",
    color: "from-green-500 to-teal-500",
    highlight: false
  },
  {
    id: 5,
    title: "Pentest Projects",
    value: 50,
    suffix: "+",
    icon: Target,
    description: "Successful engagements",
    color: "from-purple-500 to-pink-500",
    highlight: false
  },
  {
    id: 6,
    title: "Security Tools",
    value: 15,
    suffix: "+",
    icon: Shield,
    description: "Open-source contributions",
    color: "from-cyan-500 to-blue-500",
    highlight: false
  }
];

const certifications = [
  {
    name: "OSCP",
    fullName: "Offensive Security Certified Professional",
    year: "2023",
    status: "certified",
    difficulty: "Expert",
    icon: Shield,
    color: "from-red-500 to-orange-500"
  },
  {
    name: "CISSP",
    fullName: "Certified Information Systems Security Professional",
    year: "2022",
    status: "certified",
    difficulty: "Advanced",
    icon: Lock,
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "CEH",
    fullName: "Certified Ethical Hacker",
    year: "2021",
    status: "certified",
    difficulty: "Intermediate",
    icon: Zap,
    color: "from-green-500 to-emerald-500"
  },
  {
    name: "OSWE",
    fullName: "Offensive Security Web Expert",
    year: "2025",
    status: "in-progress",
    difficulty: "Expert",
    icon: Trophy,
    color: "from-purple-500 to-pink-500"
  }
];

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

function AnimatedCounter({ value, duration = 2 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000 });
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, value, isInView]);

  useEffect(() => {
    return springValue.onChange((latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toString();
      }
    });
  }, [springValue]);

  return <span ref={ref}>0</span>;
}

export function AchievementsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"
          animate={{ 
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          style={{ backgroundSize: "200% 200%" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 mb-6"
          >
            <Award className="w-8 h-8 text-yellow-400" />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-4">
            Réalisations & Impact
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Historique prouvé en recherche de vulnérabilités, divulgation responsable et aide aux organisations pour renforcer leur posture de sécurité.
          </p>
        </motion.div>

        {/* Achievements grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.8 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`relative group ${achievement.highlight ? 'lg:col-span-1' : ''}`}
              >
                <motion.div
                  className={`glass rounded-2xl p-6 text-center relative overflow-hidden ${achievement.highlight ? 'border-2 border-yellow-500/20' : ''}`}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Highlight glow for featured achievements */}
                  {achievement.highlight && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{ 
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{ backgroundSize: "200% 200%" }}
                    />
                  )}

                  {/* Icon */}
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${achievement.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ 
                      rotate: [0, -10, 10, 0],
                      scale: 1.2
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Value with animation */}
                  <motion.div 
                    className="mb-2"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className={`text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${achievement.color}`}>
                      <AnimatedCounter value={achievement.value} />
                      {achievement.suffix}
                    </span>
                  </motion.div>

                  {/* Title and description */}
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-green-400 transition-colors">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>

                  {/* Pulse effect for highlights */}
                  {achievement.highlight && (
                    <motion.div
                      className="absolute top-4 right-4 w-3 h-3 rounded-full bg-yellow-400"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Certifications section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-foreground">
            Professional Certifications
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => {
              const IconComponent = cert.icon;
              return (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={isInView ? { opacity: 1, rotateY: 0 } : { opacity: 0, rotateY: 90 }}
                  transition={{ duration: 0.8, delay: 0.8 + (index * 0.1) }}
                  whileHover={{ 
                    rotateY: 10,
                    scale: 1.05,
                    rotateX: 5
                  }}
                  style={{ transformPerspective: 1000 }}
                  className="group relative"
                >
                  <div className="glass rounded-2xl p-6 text-center relative overflow-hidden">
                    {/* Status indicator */}
                    <motion.div
                      className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
                        cert.status === 'certified' ? 'bg-green-400' : 'bg-orange-400'
                      }`}
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: cert.status === 'certified' ? [1, 0.7, 1] : [1, 0.5, 1]
                      }}
                      transition={{ 
                        duration: cert.status === 'certified' ? 2 : 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Icon */}
                    <motion.div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${cert.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <IconComponent className="w-7 h-7 text-white" />
                    </motion.div>

                    {/* Certification name */}
                    <motion.h4 
                      className="text-lg font-bold text-foreground mb-1 group-hover:text-green-400 transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      {cert.name}
                    </motion.h4>

                    {/* Full name */}
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {cert.fullName}
                    </p>

                    {/* Details */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Year:</span>
                        <span className="font-medium text-foreground">{cert.year}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Level:</span>
                        <span className={`font-medium ${
                          cert.difficulty === 'Expert' ? 'text-red-400' :
                          cert.difficulty === 'Advanced' ? 'text-orange-400' :
                          'text-green-400'
                        }`}>
                          {cert.difficulty}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={`inline-flex items-center gap-1 font-medium ${
                          cert.status === 'certified' ? 'text-green-400' : 'text-orange-400'
                        }`}>
                          {cert.status === 'certified' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <TrendingUp className="w-3 h-3" />
                          )}
                          {cert.status === 'certified' ? 'Certified' : 'In Progress'}
                        </span>
                      </div>
                    </div>

                    {/* Hover effect overlay */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.1 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recognition timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 text-center"
        >
          <motion.div
            className="inline-flex items-center gap-8 px-8 py-4 glass rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="flex items-center gap-2 text-sm font-medium"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400">Active Researcher</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 text-sm font-medium"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-blue-400">Available for Consulting</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 text-sm font-medium"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-purple-400">Open to Collaborations</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}