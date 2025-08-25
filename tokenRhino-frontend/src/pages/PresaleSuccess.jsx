import Confetti from "react-confetti";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PresaleSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Reset localStorage
    localStorage.removeItem("presaleData");
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center h-[80vh] space-y-6">
      <Confetti width={window.innerWidth} height={window.innerHeight} />
      <h1 className="text-5xl font-extrabold text-white">🎉 Your Presale is Live!</h1>
      <p className="text-gray-300 text-lg">
        Share your presale with the community and start raising funds.
      </p>
      <div className="flex space-x-4">
        <button
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
          onClick={() => navigate("/markets")}
        >
          View Markets
        </button>
        <button className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-xl">
          Share Link
        </button>
      </div>
    </div>
  );
}