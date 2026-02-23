'use client';

import { useEffect, useState } from 'react';

interface AnimatedMessageProps {
  text: string;
  isBot: boolean;
  isComplete?: boolean;
}

export function AnimatedMessage({ text, isBot, isComplete = false }: AnimatedMessageProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isComplete || !isBot) {
      setDisplayedText(text);
      setCurrentIndex(text.length);
      return;
    }

    if (text !== displayedText && currentIndex === 0) {
      setDisplayedText('');
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 20);

      return () => clearTimeout(timeout);
    }
  }, [text, currentIndex, isBot, isComplete, displayedText]);

  useEffect(() => {
    if (!isComplete && isBot) {
      setCurrentIndex(0);
      setDisplayedText('');
    }
  }, [text, isComplete, isBot]);

  return (
    <div className="whitespace-pre-wrap">
      {displayedText}
      {isBot && currentIndex < text.length && (
        <span className="inline-block ml-0.5 h-4 w-1 animate-pulse bg-emerald-600" />
      )}
    </div>
  );
}