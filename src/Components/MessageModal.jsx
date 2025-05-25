export default function MessageModal({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white px-5 py-2 rounded-xl shadow-lg w-full max-w-sm">
        <div className="flex justify-end items-center mb-1">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-2xl font-bold"
          >
            &times;
          </button>
        </div>
        <p className="text-gray-700 text-center mb-4">{message}</p>
      </div>
    </div>
  );
}
