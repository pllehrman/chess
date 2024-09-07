"use client";

import { ReadyState } from "react-use-websocket";
import React, { useState, useEffect } from "react";

export const Chat = React.memo(
  ({
    messageHistory,
    currentMessage,
    setCurrentMessage,
    sendChat,
    readyState,
    twoPeoplePresent,
  }) => {
    const isChatAvailable = readyState === ReadyState.OPEN && twoPeoplePresent;

    return (
      <div className="h-[75vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        {twoPeoplePresent ? (
          <h1 className="text-xl">
            Chat With Opponent
            <span className="font-semibold"></span>{" "}
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                isChatAvailable ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </h1>
        ) : (
          <h1 className="text-xl">
            Waiting for Opponent{" "}
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                isChatAvailable ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </h1>
        )}
        <div className="mt-4 flex space-x-2">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder={
              isChatAvailable ? "Enter your message" : "Chat is unavailable"
            }
            disabled={!isChatAvailable}
            className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
          <button
            onClick={sendChat}
            disabled={!isChatAvailable}
            className={`px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-300 ${
              !isChatAvailable ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Send
          </button>
        </div>
        <hr className="my-4 border-gray-300 dark:border-gray-600" />
        <div className="mt-6">
          <h2 className="text-lg font-bold">Messages:</h2>
          <div className="mt-4 space-y-2">
            {messageHistory.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No messages yet.
              </p>
            ) : (
              messageHistory
                .slice() // Create a shallow copy of the array to avoid mutating original data
                .reverse() // Reverse the array to show most recent messages at the top
                .map((message, index) => (
                  <div
                    key={index}
                    className={`${
                      message.fromMe
                        ? "text-right bg-blue-100 dark:bg-blue-800"
                        : "text-left bg-gray-100 dark:bg-gray-700"
                    } p-2 rounded-md`}
                  >
                    <strong>
                      {message.fromMe
                        ? "You"
                        : `${message.sessionUsername} (Opponent)`}
                      :
                    </strong>{" "}
                    {message.message}
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.messageHistory === nextProps.messageHistory &&
    prevProps.currentMessage === nextProps.currentMessage &&
    prevProps.readyState === nextProps.readyState &&
    prevProps.twoPeoplePresent === nextProps.twoPeoplePresent
);
