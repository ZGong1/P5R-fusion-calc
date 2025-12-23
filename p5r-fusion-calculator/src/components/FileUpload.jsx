import { useState } from 'react';
import { decryptSaveFile } from '../utils/decrypt';
import { usePersonas } from '../contexts/PersonaContext';
import HexViewer from './HexViewer';
import './FileUpload.css';

function FileUpload() {
    const { handleDecryptSuccess, saveMetaData } = usePersonas();
    const [decryptedData, setDecryptedData] = useState(null);
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        console.log('File selected:', file.name, file.size, 'bytes');

        setIsProcessing(true);
        setError(null);
        setDecryptedData(null);
        setLogs([]);

        try {
            console.log('Reading file...');
            const arrayBuffer = await file.arrayBuffer();
            console.log('File read, size:', arrayBuffer.byteLength);

            console.log('Starting decryption...');
            const result = decryptSaveFile(arrayBuffer);
            console.log('Decryption result:', result);

            if (result.success) {
                console.log('Decryption successful, data size:', result.data.length);
                setDecryptedData(result.data);
                setLogs(result.logs);

                // Call the success callback to extract personas
                handleDecryptSuccess(result.data);
            } else {
                console.error('Decryption failed:', result.error);
                setError(result.error);
                setLogs(result.logs);
            }
        } catch (err) {
            console.error('Exception during decryption:', err);
            setError(`Failed to process file: ${err.message}\n${err.stack}`);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="file-upload-container">
            <div className="upload-section">
                <h2>P5R Save Analyzer</h2>
                <p>Upload a DATA.DAT save file to have it analyzed and put into a persona inventory</p>
                <p>Save data is saved at "%APPDATA%\SEGA\P5R\Steam\[your steam ID]\savedata" when using Windows + Steam</p>

                <div className="file-input-wrapper">
                    <input
                        type="file"
                        id="file-upload"
                        accept=".DAT,.dat"
                        onChange={handleFileUpload}
                        disabled={isProcessing}
                    />
                    <label htmlFor="file-upload" className={isProcessing ? 'disabled' : ''}>
                        {isProcessing ? 'Processing...' : 'Choose File'}
                    </label>
                </div>

                <h1>Save metadata:</h1>
                <p>{JSON.stringify(saveMetaData)}</p>

                {error && (
                    <div className="error-message">
                        <strong>Error:</strong> {error}
                        {logs.length > 0 && (
                            <details>
                                <summary>Show logs</summary>
                                <pre>{logs.join('\n')}</pre>
                            </details>
                        )}
                    </div>
                )}
            </div>

            {decryptedData && <HexViewer data={decryptedData} logs={logs} />}
        </div>
    );
}

export default FileUpload;
