import React from 'react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center z-50">
      <img 
        src="https://bs.uenicdn.com/blog/wp-content/uploads/2018/04/giphy.gif" 
        alt="Loading..."
        className="w-32 h-32"
      />
    </div>
  );
};