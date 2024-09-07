"use client";

import React from "react";
import { useState, useEffect } from "react";

export const Timers = React.memo(
  ({
    whiteTime,
    blackTime,
    setWhiteTime,
    setBlackTime,
    increment,
    currentTurn,
    twoPeoplePresent,
    isFirstMove,
    winner,
    setResult,
    setWinner,
  }) => {
    useEffect(() => {
      if (!twoPeoplePresent || isFirstMove || winner) return;

      const timer = setInterval(() => {
        if (currentTurn === "w") {
          setWhiteTime((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (currentTurn === "b") {
          setBlackTime((prev) => (prev > 0 ? prev - 1 : 0));
        }
      }, 1000);

      return () => clearInterval(timer); // Clear timer on cleanup or turn change
    }, [currentTurn, twoPeoplePresent, isFirstMove]);

    // Increment effect: responsible for applying increment when the turn changes
    useEffect(() => {
      if (twoPeoplePresent && !isFirstMove && !winner) {
        // Apply increment based on the last turn
        return () => {
          if (currentTurn === "w") {
            setBlackTime((prev) => (prev > 0 ? prev + increment : 0));
          } else if (currentTurn === "b") {
            setWhiteTime((prev) => (prev > 0 ? prev + increment : 0));
          }
        };
      }
    }, [currentTurn]);

    useEffect(() => {
      // If there are two people present and no winner yet
      if (twoPeoplePresent && !winner) {
        if (whiteTime === 0) {
          // If White runs out of time
          setResult("lost on time");
          setWinner("black");
        } else if (blackTime === 0) {
          // If Black runs out of time
          setResult("lost on time");
          setWinner("white");
        }
      }
    }, [whiteTime, blackTime]);

    return (
      <div className="flex justify-between w-full mb-2">
        {/* Timer for White Player */}
        <div className="text-center bg-gray-100 dark:bg-gray-800 p-2 rounded-md shadow-md">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            White
          </p>
          <p className="text-xl font-mono text-gray-800 dark:text-gray-200 tracking-tight">
            {Math.floor(whiteTime / 60)}:{("0" + (whiteTime % 60)).slice(-2)}
          </p>
        </div>

        {/* Timer for Black Player */}
        <div className="text-center bg-gray-100 dark:bg-gray-800 p-2 rounded-md shadow-md">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Black
          </p>
          <p className="text-xl font-mono text-gray-800 dark:text-gray-200 tracking-tight">
            {Math.floor(blackTime / 60)}:{("0" + (blackTime % 60)).slice(-2)}
          </p>
        </div>
      </div>
    );
  }
);
