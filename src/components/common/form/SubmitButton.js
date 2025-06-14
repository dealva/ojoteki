const SubmitButton = ({ text, loading }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? `Menunggu Proses ...` : text}
    </button>
  );
};

export default SubmitButton;
