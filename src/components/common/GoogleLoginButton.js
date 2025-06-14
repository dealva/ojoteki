'use client';

const GoogleLoginButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#C24B4B] text-white rounded-md hover:bg-[#a53c3c] transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 533.5 544.3"
        className="w-5 h-5"
      >
        {/* Google "G" logo path */}
        <path fill="#4285F4" d="M533.5 278.4c0-17.1-1.5-33.5-4.3-49.5H272v93.8h146.9c-6.4 34.7-25.6 64.1-54.8 83.7v69.4h88.5c51.9-47.8 81.9-118 81.9-197.4z"/>
        <path fill="#34A853" d="M272 544.3c73.7 0 135.6-24.3 180.7-66.1l-88.5-69.4c-24.6 16.5-56 26.1-92.2 26.1-70.9 0-131-47.9-152.6-112.2H30.9v70.3C75.6 480.9 167.5 544.3 272 544.3z"/>
        <path fill="#FBBC04" d="M119.4 323.7c-10.7-31.6-10.7-65.9 0-97.5v-70.3H30.9c-38.8 75.8-38.8 165.2 0 241l88.5-73.2z"/>
        <path fill="#EA4335" d="M272 107.7c39.9-.6 78.3 14 107.5 40.4l80.7-80.7C407 24.6 344.8 0 272 0 167.5 0 75.6 63.4 30.9 158.9l88.5 70.3c21.6-64.3 81.7-112.2 152.6-121.5z"/>
      </svg>
      Masuk dengan Google
    </button>
  );
};

export default GoogleLoginButton;
