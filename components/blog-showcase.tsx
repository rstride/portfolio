"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
    Shield,
    Lock,
    Target,
    Bug,
    Calendar,
    ArrowRight,
    User
} from "lucide-react";
import { PostData } from "@/lib/posts";

export function BlogShowcase({ posts }: { posts: PostData[] }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    return (
        <div ref={ref} className="relative min-h-screen overflow-hidden">
            {/* Cybersecurity Background Effects */}
            <div className="absolute inset-0 -z-10">
                {/* Matrix-style grid */}
                <motion.div
                    className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"
                    animate={{
                        backgroundPosition: ["0px 0px", "60px 60px", "0px 0px"],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />

                {/* Gradient orbs */}
                <motion.div
                    className="absolute -top-40 -left-40 h-80 w-80 rounded-full blur-3xl opacity-15 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full blur-3xl opacity-10 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600"
                    animate={{
                        x: [0, -30, 0],
                        y: [0, -40, 0],
                        scale: [1, 1.1, 1],
                        rotate: [360, 180, 0]
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                />

                {/* Floating security icons */}
                {[Shield, Lock, Target, Bug].map((Icon, index) => (
                    <motion.div
                        key={index}
                        className="absolute"
                        style={{
                            left: `${15 + (index * 20)}%`,
                            top: `${20 + (index % 2) * 30}%`
                        }}
                        animate={{
                            opacity: [0.1, 0.3, 0.1],
                            scale: [0.8, 1.2, 0.8],
                            y: [0, -20, 0],
                            x: [0, 15, 0],
                            rotate: [0, 360, 720]
                        }}
                        transition={{
                            duration: 8 + (index * 1.5),
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 1
                        }}
                    >
                        <Icon className="w-5 h-5 text-green-400/20" />
                    </motion.div>
                ))}
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                {/* Header Section */}
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
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 mb-6"
                    >
                        <Shield className="w-8 h-8 text-blue-400" />
                    </motion.div>
                    <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500 mb-4">
                        Blog
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Retours d&apos;expérience, tutoriels et analyses sur la sécurité offensive et défensive.
                    </p>
                </motion.div>

                {/* Blog Posts Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.slug}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="group relative"
                        >
                            <Link href={`/blog/${post.slug}`} className="block h-full">
                                <motion.div
                                    className="glass rounded-2xl p-0 h-full cursor-pointer relative overflow-hidden flex flex-col"
                                    whileHover={{
                                        scale: 1.02,
                                        y: -5,
                                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Hover overlay */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 0.1 }}
                                    />

                                    {/* Cover Image */}
                                    {post.coverImage && (
                                        <div className="aspect-video w-full overflow-hidden relative">
                                            <div
                                                className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                                style={{ backgroundImage: `url(${post.coverImage})` }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60" />
                                        </div>
                                    )}

                                    <div className="p-6 flex flex-col flex-1 relative z-20">
                                        {/* Date */}
                                        <div className="flex items-center gap-2 text-xs text-blue-400 mb-3">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(post.date).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>

                                        {/* Title */}
                                        <motion.h3
                                            className="text-xl font-semibold text-foreground mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-500 transition-all duration-300"
                                            whileHover={{ x: 2 }}
                                        >
                                            {post.title}
                                        </motion.h3>

                                        {/* Excerpt */}
                                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed line-clamp-3 flex-1">
                                            {post.excerpt}
                                        </p>

                                        {/* Read More */}
                                        <div className="flex items-center gap-2 text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors mt-auto">
                                            Lire l&apos;article
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>

                            {/* Glow effect */}
                            <motion.div
                                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 blur-xl -z-10"
                                animate={{ opacity: [0, 0.1, 0] }}
                                transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
