import React from 'react';
import Navbar from '../Navbar/Navbar';


function App() {
  return <NotFoundPage />;
}

const NotFoundPage = () => {
  return (
    <>
    <Navbar/>
    <div className="bg-[#F6F4DF] min-h-screen flex flex-col items-center justify-center p-4 font-sans text-gray-800">
      <div className="text-center w-full max-w-md">

        <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-[#5a5a5a]">
          Oops! Page Not Found
        </h2>

        <p className="mt-3 text-md md:text-lg text-[#6e6e6e]">
          It seems you've taken a wrong turn. The page you are looking for doesn't exist.
        </p>
      </div>
      <footer className="absolute bottom-4 text-center text-sm text-[#8a8a8a]">
        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </footer>
    </div>
    </>
  );
};

export default App;
