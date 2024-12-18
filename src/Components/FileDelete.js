import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FileDelete() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await axios.get('http://localhost:5005/api/files/list');
            setFiles(response.data);
        } catch (error) {
            console.error('Failed to fetch files', error);
        }
    };

    const handleDelete = async () => {
        if (!selectedFile) {
            setMessage('Please select a file to delete');
            return;
        }

        try {
            await axios.delete(`http://localhost:5005/api/files/delete/${selectedFile}`);
            setMessage('File deleted successfully');

            // Refresh file list
            fetchFiles();
            setSelectedFile('');
        } catch (error) {
            setMessage('Failed to delete file');
            console.error(error);
        }
    };

    return (
        <div className="delete-container">
            <h2>Delete File</h2>
            <select
                value={selectedFile}
                onChange={(e) => setSelectedFile(e.target.value)}
            >
                <option value="">Select a file</option>
                {files.map((file) => (
                    <option key={file._id} value={file._id}>
                        {file.originalname}
                    </option>
                ))}
            </select>
            <button onClick={handleDelete}>Delete</button>
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default FileDelete;