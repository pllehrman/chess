"use client";

import React, { useState, useEffect } from "react";

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
    }, [currentTurn, twoPeoplePresent, isFirstMove, winner]);

    // Increment effect: responsible for applying increment when the turn changes
    useEffect(() => {
      if (twoPeoplePresent && !isFirstMove && !winner) {
        return () => {
          if (currentTurn === "w") {
            setBlackTime((prev) => (prev > 0 ? prev + increment : 0));
          } else if (currentTurn === "b") {
            setWhiteTime((prev) => (prev > 0 ? prev + increment : 0));
          }
        };
      }
    }, [currentTurn, winner]);

    return (
      <div className="flex justify-between w-full pl-4 pr-4">
        {/* Timer for White Player */}
        <div className="text-center bg-gray-100 dark:bg-gray-800 p-2 rounded-md shadow-md">
          <p className="text-sm sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
            White
          </p>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-mono text-gray-800 dark:text-gray-200 tracking-tight">
            {Math.floor(whiteTime / 60)}:{("0" + (whiteTime % 60)).slice(-2)}
          </p>
        </div>

        {/* Timer for Black Player */}
        <div className="text-center bg-gray-100 dark:bg-gray-800 p-2 rounded-md shadow-md">
          <p className="text-sm sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
            Black
          </p>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-mono text-gray-800 dark:text-gray-200 tracking-tight">
            {Math.floor(blackTime / 60)}:{("0" + (blackTime % 60)).slice(-2)}
          </p>
        </div>
      </div>
    );
  }
);
