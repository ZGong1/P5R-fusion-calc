import { useState } from 'react';
import './HexViewer.css';

function HexViewer({ data, logs }) {
    const [bytesPerRow, setBytesPerRow] = useState(16);
    const [maxRows, setMaxRows] = useState(100);

    if (!data) {
        return null;
    }

    const totalRows = Math.ceil(data.length / bytesPerRow);
    const displayRows = Math.min(totalRows, maxRows);

    const renderRow = (rowIndex) => {
        const offset = rowIndex * bytesPerRow;
        const rowData = data.slice(offset, offset + bytesPerRow);

        // Hex representation
        const hexBytes = Array.from(rowData)
            .map(b => b.toString(16).padStart(2, '0'))
            .join(' ');

        // ASCII representation
        const ascii = Array.from(rowData)
            .map(b => (b >= 0x20 && b <= 0x7E) ? String.fromCharCode(b) : '.')
            .join('');

        return (
            <div key={rowIndex} className="hex-row">
                <span className="hex-offset">{offset.toString(16).padStart(8, '0')}</span>
                <span className="hex-bytes">{hexBytes.padEnd(bytesPerRow * 3 - 1, ' ')}</span>
                <span className="hex-ascii">{ascii}</span>
            </div>
        );
    };

    return (
        <div className="hex-viewer-container">
            <div className="hex-controls">
                <label>
                    Bytes per row:
                    <select value={bytesPerRow} onChange={(e) => setBytesPerRow(Number(e.target.value))}>
                        <option value={8}>8</option>
                        <option value={16}>16</option>
                        <option value={32}>32</option>
                    </select>
                </label>
                <label>
                    Max rows:
                    <select value={maxRows} onChange={(e) => setMaxRows(Number(e.target.value))}>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={500}>500</option>
                        <option value={1000}>1000</option>
                        <option value={10000}>All ({totalRows} rows)</option>
                    </select>
                </label>
                <span className="hex-info">
                    Total size: {data.length} bytes (0x{data.length.toString(16)})
                </span>
            </div>

            {logs && logs.length > 0 && (
                <div className="decrypt-logs">
                    <h3>Decryption Log:</h3>
                    <pre>{logs.join('\n')}</pre>
                </div>
            )}

            <div className="hex-viewer">
                {Array.from({ length: displayRows }, (_, i) => renderRow(i))}
                {displayRows < totalRows && (
                    <div className="hex-truncated">
                        ... {totalRows - displayRows} more rows (increase max rows to see more)
                    </div>
                )}
            </div>
        </div>
    );
}

export default HexViewer;
