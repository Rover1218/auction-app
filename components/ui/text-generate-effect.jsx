"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";

export const TextGenerateEffect = ({ words, className }) => {
    const [scope, animate] = useAnimate();
    const wordsArray = words.split(" ");

    useEffect(() => {
        animate(
            "span",
            {
                opacity: 1,
            },
            {
                duration: 2,
                delay: stagger(0.2),
            }
        );
    }, [animate]);

    return (
        <motion.div ref={scope} className={className}>
            {wordsArray.map((word, idx) => (
                <motion.span
                    initial={{ opacity: 0 }}
                    key={`${word}-${idx}`}
                    className="opacity-0 inline-block mr-2.5"
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
};
