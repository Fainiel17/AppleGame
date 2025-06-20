import { useEffect, useRef } from "react";
import { GameCanvas } from "./GameCanvas";
import { GameUI } from "./GameUI";
import { Leaderboard } from "./Leaderboard";
import { ScoreSubmission } from "./ScoreSubmission";
import { LanguageSelector } from "./LanguageSelector";
import { useAppleGame } from "../lib/stores/useAppleGame";
import { useAudio } from "../lib/stores/useAudio";
import { useLanguage } from "../lib/stores/useLanguage";

export function AppleGame() {
  const { 
    gameState, 
    score,
    showScoreSubmission,
    startGame, 
    resetGame, 
    showScoreSubmissionDialog,
    hideScoreSubmissionDialog,
    getCompletionTime
  } = useAppleGame();
  const { toggleMute, isMuted, backgroundMusic } = useAudio();
  const gameStarted = useRef(false);

  useEffect(() => {
    if (gameState === "playing" && !gameStarted.current) {
      gameStarted.current = true;
      if (backgroundMusic && !isMuted) {
        backgroundMusic.play().catch(console.log);
      }
    }
    
    if (gameState === "ready") {
      gameStarted.current = false;
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
      }
    }
  }, [gameState, backgroundMusic, isMuted]);

  const handleStart = () => {
    startGame();
  };

  const handleRestart = () => {
    resetGame();
  };

  return (
    <div className="min-h-screen py-4 px-4">
      {/* Language Selector */}
      <div className="fixed top-4 right-4 z-10">
        <LanguageSelector />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex gap-6 items-start justify-center">
        {/* Main Game Area */}
        <div className="flex flex-col items-center gap-4">
          <GameUI />
          <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden" style={{ width: '850px', height: '500px' }}>
            <GameCanvas />
          </div>
        </div>
        {/* Leaderboard */}
        <Leaderboard />
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col items-center gap-4 max-w-full pt-16">
        <GameUI />
        <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-md">
          <GameCanvas />
        </div>
        <div className="w-full max-w-md">
          <Leaderboard />
        </div>
      </div>
      
      {/* Start Screen */}
      {gameState === "ready" && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center shadow-xl">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">🍎 Apple Game</h1>
            <p className="text-gray-600 mb-6 max-w-md">
              Drag to select apples that sum to 10!<br/>
              You have 2 minutes to get the highest score.
            </p>
            <button
              onClick={handleStart}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Start Game
            </button>
            <div className="mt-4">
              <button
                onClick={toggleMute}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                🔊 Sound: {isMuted ? "OFF" : "ON"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Game Over Screen */}
      {gameState === "gameOver" && !showScoreSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center shadow-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">게임 종료!</h2>
            <p className="text-xl text-gray-600 mb-6">
              최종 점수: <span className="font-bold text-red-500">{score}</span>
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={showScoreSubmissionDialog}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-colors"
              >
                점수 등록
              </button>
              <button
                onClick={handleRestart}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                다시 하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Score Submission Dialog */}
      {showScoreSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ScoreSubmission
            score={score}
            timeCompleted={getCompletionTime()}
            onSubmitted={() => {
              hideScoreSubmissionDialog();
              handleRestart();
            }}
            onCancel={() => hideScoreSubmissionDialog()}
          />
        </div>
      )}
    </div>
  );
}
