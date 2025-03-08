"use client"
// pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  // Use client-side only code
  const [isClient, setIsClient] = useState(false);

  // Ensure we're running on client before rendering file input
  useEffect(() => {
    setIsClient(true);
  }, []);

  const processFile = (file) => {
    // Example processing function
    // Replace this with your actual processing logic
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setIsProcessing(true);
        
        // Get file content
        const content = event.target.result;
        
        // Example processing: count words in a text file
        const wordCount = content.split(/\s+/).filter(Boolean).length;
        
        // Simulate processing time
        setTimeout(() => {
          setIsProcessing(false);
          resolve({
            wordCount,
            fileName: file.name,
            fileSize: file.size,
            // Add more processed data as needed
          });
        }, 500);
      };
      
      // Read file as text - change this based on your file type needs
      reader.readAsText(file);
      // For binary files: reader.readAsArrayBuffer(file);
      // For images: reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setFileName(file.name);
    setResult(null);
    
    try {
      // Process the file and get results
      const processedData = await processFile(file);
      setResult(processedData);
    } catch (error) {
      console.error("Error processing file:", error);
      setResult({ error: "Failed to process file" });
    }
  };

  return (
    <div>
      <Head>
        <title>Next.js File Processor</title>
        <meta name="description" content="Process files locally using Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen p-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Local File Processor
          </h1>
          
          {isClient && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Select a file to process:
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-gray-700 border border-gray-300 rounded p-2"
              />
            </div>
          )}
          
          {fileName && !result && isProcessing && (
            <p className="text-blue-600">Processing {fileName}...</p>
          )}
          
          {result && (
            <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-50">
              <h2 className="font-medium mb-2">Results:</h2>
              <p>File: {result.fileName}</p>
              <p>Size: {(result.fileSize / 1024).toFixed(2)} KB</p>
              <p>Word count: {result.wordCount}</p>
              {/* Display more processed data here */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}