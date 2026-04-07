import { useState } from "react";

function App() {
  const [yourNumber, setYourNumber] = useState(35);
  const [nowServing, setNowServing] = useState(32);

  const refreshQueue = () => {
    const newNowServing = Math.floor(Math.random() * yourNumber) + 1;
    const newYourNumber = newNowServing + Math.floor(Math.random() * 10) + 1;
    setNowServing(newNowServing);
    setYourNumber(newYourNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">QueueLess Demo</h1>
        <p className="text-gray-700 mb-6">
          Track your queue without staying in line physically.
        </p>

        <div className="bg-blue-100 rounded-lg p-4 mb-6">
          <p className="text-gray-600">Your Queue Number</p>
          <p className="text-3xl font-bold text-blue-600">{yourNumber}</p>
        </div>

        <div className="bg-green-100 rounded-lg p-4 mb-6">
          <p className="text-gray-600">Now Serving</p>
          <p className="text-3xl font-bold text-green-600">{nowServing}</p>
        </div>

        <div className="text-left bg-gray-100 rounded-lg p-4">
          <h2 className="font-semibold mb-2">Next Steps</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Check the website on your phone</li>
            <li>Do other errands while waiting</li>
            <li>Receive notification when {nowServing} is near {yourNumber}</li>
            <li>Return before your turn is called</li>
          </ul>
        </div>

        <button
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={refreshQueue}
        >
          Refresh Queue
        </button>
      </div>
    </div>
  );
}

export default App;