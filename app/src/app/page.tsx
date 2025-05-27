'use client';

import { useState } from 'react';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResults([]);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('file', image);

    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">SmartInspect.AI</h1>

      <input type="file" accept="image/*" onChange={handleImageChange} />

      {previewUrl && (
        <img src={previewUrl} alt="Preview" className="my-4 max-w-md rounded shadow" />
      )}

      <button
        onClick={handleSubmit}
        disabled={!image || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze Image'}
      </button>

      {results.length > 0 && (
        <div className="mt-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-2">Detected Objects:</h2>
          <ul className="list-disc pl-5">
            {results.map((obj, index) => (
              <li key={index}>
                {obj.label} ({Math.round(obj.score * 100)}%)
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}

