export const DeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Auction</h3>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete "{itemName}"? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};
