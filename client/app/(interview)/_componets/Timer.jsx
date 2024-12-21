"use client"
import React, { useState, useEffect } from "react";

const Timer = ({ time }) => {
  const [timeLeft, setTimeLeft] = useState(time * 60); 
  const [isActive, setIsActive] = useState(true);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? `0${minutes}` : minutes}:${
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
    }`;
  };

  useEffect(() => {
    let interval;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      alert("Time's up!");
    }

    return () => clearInterval(interval); 
  }, [isActive, timeLeft]);

  return (
    <div className="timer">
      <div className="time-display text-xl">{formatTime(timeLeft)}</div>
    </div>
  );
};

export default Timer;
