"use client";

const Breadcrumb = () => {
  return (
    <nav className="text-sm text-gray-600 py-2 px-4 flex items-center">
      {typeof window !== "undefined" && window.history.length > 1 && (
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition"
        >
          <span className="text-lg">←</span>
          <span>Back</span>
        </button>
      )}
    </nav>
  );
};

export default Breadcrumb;
