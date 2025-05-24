import React from 'react';

const Error = ({ message = "Something went wrong." }) => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops! An Error Occurred</h1>
      <p className="text-gray-600 mb-4">{message}</p>
      <button
        onClick={handleBack}
        className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded transition"
      >
        Go Back
      </button>
    </div>
  );
};

export default Error;
