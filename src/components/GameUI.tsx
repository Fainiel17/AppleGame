import { useAppleGame } from "../lib/stores/useAppleGame";
import { useAudio } from "../lib/stores/useAudio";
import { useLanguage } from "../lib/stores/useLanguage";

export function GameUI() {
  const { score, timeLeft, gameState, hints, useHint } = useAppleGame();
  const { toggleMute, isMuted } = useAudio();
  const { t } = useLanguage();

  if (gameState === "ready") return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timePercentage = (timeLeft / 120) * 100;

  return (
    <div className="w-full max-w-4xl">
      {/* Desktop UI */}
      <div className="hidden md:flex justify-between items-center bg-gray-800 text-white rounded-lg p-4 shadow-lg">
        <div className="bg-gray-700 rounded-lg px-4 py-2">
          <div className="text-sm text-gray-300">{t('score')}</div>
          <div className="text-2xl font-bold text-white">{score}</div>
        </div>

        {gameState === "playing" && (
          <div className="text-center">
            <div className="text-lg font-medium text-white">
              {t('dragInstruction')}
            </div>
          </div>
        )}

        <div className="bg-gray-700 rounded-lg px-4 py-2 min-w-[120px]">
          <div className="text-sm text-gray-300">{t('time')}</div>
          <div className="text-2xl font-bold text-white">{formatTime(timeLeft)}</div>
          <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all duration-100 ${
                timePercentage > 30 ? 'bg-green-500' : 
                timePercentage > 10 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${timePercentage}%` }}
            />
          </div>
        </div>

        <button
          onClick={useHint}
          disabled={hints === 0}
          className={`rounded-lg px-4 py-2 font-medium transition-colors ${
            hints > 0 
              ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
              : 'bg-gray-500 text-gray-300 cursor-not-allowed'
          }`}
        >
          💡 힌트 ({hints})
        </button>

        <button
          onClick={toggleMute}
          className="bg-gray-700 rounded-lg px-3 py-2 hover:bg-gray-600 transition-colors text-white"
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>

      {/* Mobile UI */}
      <div className="md:hidden bg-gray-800 text-white rounded-lg p-3 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <div className="bg-gray-700 rounded-lg px-3 py-2 flex-1 mr-2">
            <div className="text-xs text-gray-300">{t('score')}</div>
            <div className="text-xl font-bold text-white">{score}</div>
          </div>
          
          <div className="bg-gray-700 rounded-lg px-3 py-2 flex-1 ml-2">
            <div className="text-xs text-gray-300">{t('time')}</div>
            <div className="text-xl font-bold text-white">{formatTime(timeLeft)}</div>
          </div>
        </div>

        <div className="w-full bg-gray-600 rounded-full h-2 mb-3">
          <div
            className={`h-2 rounded-full transition-all duration-100 ${
              timePercentage > 30 ? 'bg-green-500' : 
              timePercentage > 10 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${timePercentage}%` }}
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={useHint}
            disabled={hints === 0}
            className={`rounded-lg px-3 py-2 font-medium transition-colors text-sm ${
              hints > 0 
                ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
          >
            💡 {t('hint')} ({hints})
          </button>

          <button
            onClick={toggleMute}
            className="bg-gray-700 rounded-lg px-3 py-2 hover:bg-gray-600 transition-colors text-white"
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        </div>

        {gameState === "playing" && (
          <div className="text-center mt-3">
            <div className="text-sm text-white">
              {t('touchInstruction')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
