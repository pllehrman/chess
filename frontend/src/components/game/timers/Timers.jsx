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
  }) => {
    useEffect(() => {
      if (!twoPeoplePresent) return;

      // Start the timer
      const timer = setInterval(() => {
        if (currentTurn === "white") {
          setWhiteTime((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (currentTurn === "black") {
          setBlackTime((prev) => (prev > 0 ? prev - 1 : 0));
        }
      }, 1000);

      return () => {
        // Apply increment when the turn changes
        if (currentTurn === "white") {
          setWhiteTime((prev) => (prev > 0 ? prev + increment : 0));
        } else if (currentTurn === "black") {
          setBlackTime((prev) => (prev > 0 ? prev + increment : 0));
        }

        // Clear the timer when the effect is cleaned up (i.e., turn changes)
        clearInterval(timer);
      };
    }, [currentTurn, twoPeoplePresent]); // Only these dependencies are needed

    return (
      <div className="flex justify-between w-full mb-4">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            White
          </p>
          <p className="text-gray-900 dark:text-gray-100">
            {Math.floor(whiteTime / 60)}:{("0" + (whiteTime % 60)).slice(-2)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Black
          </p>
          <p className="text-gray-900 dark:text-gray-100">
            {" "}
            {Math.floor(blackTime / 60)}:{("0" + (blackTime % 60)).slice(-2)}
          </p>
        </div>
      </div>
    );
  }
);
