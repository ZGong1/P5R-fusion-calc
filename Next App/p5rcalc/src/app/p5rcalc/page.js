"use client"
// pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import personaDictionary from './dictionary';

export default function Home() {
  const [results, setResults] = useState([]);
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're running on client before rendering file input
  useEffect(() => {
    setIsClient(true);
  }, []);

  const analyzeHexFile = (buffer) => {
    const results = [];
    
    for (let i = 0; i < buffer.length - 3; i++) {
      if (buffer[i] === 0x01 && buffer[i + 1] === 0x00) {
        const byte1 = buffer[i + 2];
        const byte2 = buffer[i + 3];
        
        let lastNibble = i & 0b1111;

        if (byte1 === 0x00 && byte2 === 0x00) { // blank entry, not in compendium
          continue;
        } else if (lastNibble) { // last nibble of address has to be 0
          continue;
        } else if ((i > 0x4000 && i < 0x5FFF) || (i > 0x6000 && i < 0x9FFF)) { // valid persona ranges
          const hexValue = `0x${byte2.toString(16).padStart(2, '0')}${byte1.toString(16).padStart(2, '0').toUpperCase()}`;
          results.push({
            address: `0x${i.toString(16).padStart(8, '0')}`,
            value: hexValue,
            name: personaDictionary[hexValue] || "Unknown"
          });
        }
      }
    }
    
    return results;
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setFileName(file.name);
    setResults([]);
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const buffer = new Uint8Array(arrayBuffer);
      const processedResults = analyzeHexFile(buffer);
      setResults(processedResults);
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Error processing file: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsArrayBuffer(file);
    });
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(results, null, 2);
    downloadFile(dataStr, 'results.json', 'application/json');
  };

  const downloadCSV = () => {
    const csvHeader = 'Address,Value,Name\n';
    const csvRows = results.map(item => 
      `${item.address},${item.value},${item.name || ""}`
    ).join('\n');
    
    downloadFile(csvHeader + csvRows, 'results.csv', 'text/csv');
  };

  const downloadFile = (content, fileName, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <Head>
        <title>Persona Hex File Analyzer</title>
        <meta name="description" content="Analyze Persona hex files locally in your browser" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Persona Hex File Analyzer
          </h1>
          
          {isClient && (
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">
                Select a hex file (.dec) to analyze:
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-gray-700 border border-gray-300 rounded p-2"
                accept=".dec,.bin,.hex"
              />
            </div>
          )}
          
          {fileName && isProcessing && (
            <div className="mb-4 text-blue-600">
              Processing {fileName}...
            </div>
          )}
          
          {results.length > 0 && (
            <div className="mb-6">
              <div className="flex space-x-4 mb-4">
                <button 
                  onClick={downloadJSON}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Download JSON
                </button>
                <button 
                  onClick={downloadCSV}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Download CSV
                </button>
              </div>
              
              <div className="text-sm mb-2 text-gray-600">
                Found {results.length} personas in the file.
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Persona Name</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{item.address}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{item.value}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name || "Unknown"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}