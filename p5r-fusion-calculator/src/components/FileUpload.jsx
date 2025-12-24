import { useState } from 'react';
import { decryptSaveFile } from '../utils/decrypt';
import { usePersonas } from '../contexts/PersonaContext';
import HexViewer from './HexViewer';
import './FileUpload.css';

function FileUpload() {
    const { handleDecryptSuccess, saveMetaData, personas } = usePersonas();
    const [decryptedData, setDecryptedData] = useState(null);
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showVerbose, setShowVerbose] = useState(false);

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

                {decryptedData && (
                    <div className="verbose-toggle">
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={showVerbose}
                                onChange={(e) => setShowVerbose(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                            <span className="toggle-label">Show verbose output</span>
                        </label>
                    </div>
                )}

                {saveMetaData && saveMetaData.inGameName && (
                    <div className="save-metadata-card">
                        <h3>Save File Information</h3>
                        <div className="metadata-grid">
                            <div className="metadata-item">
                                <span className="metadata-label">Character Name</span>
                                <span className="metadata-value">{saveMetaData.inGameName}</span>
                            </div>
                            <div className="metadata-item">
                                <span className="metadata-label">Level</span>
                                <span className="metadata-value">{saveMetaData.playerLevel}</span>
                            </div>
                            <div className="metadata-item">
                                <span className="metadata-label">Date & Time</span>
                                <span className="metadata-value">{saveMetaData.inGameDay}</span>
                            </div>
                            <div className="metadata-item">
                                <span className="metadata-label">Location</span>
                                <span className="metadata-value">{saveMetaData.inGameLocation}</span>
                            </div>
                            <div className="metadata-item">
                                <span className="metadata-label">Play Time</span>
                                <span className="metadata-value">{saveMetaData.playTime}</span>
                            </div>
                            <div className="metadata-item">
                                <span className="metadata-label">Difficulty</span>
                                <span className="metadata-value difficulty-{saveMetaData.difficulty?.toLowerCase()}">{saveMetaData.difficulty}</span>
                            </div>
                        </div>
                        <div className="progress-section">
                            <div className="progress-item">
                                <div className="progress-header">
                                    <span className="progress-label">Compendium Completion</span>
                                    <span className="progress-percentage">{personas.length}/232 ({Math.round((personas.length / 232) * 100)}%)</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${(personas.length / 232) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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

            {decryptedData && <HexViewer data={decryptedData} logs={logs} showVerbose={showVerbose} />}
        </div>
    );
}

export default FileUpload;
