import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FileList() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/files/list');
      setFiles(response.data);
    } catch (error) {
      setError('Failed to fetch files');
      console.error(error);
    }
  };

  return (
    <div className="file-list-container">
      <h2>Uploaded Files</h2>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Original Name</th>
            <th>File Type</th>
            <th>Size (bytes)</th>
            <th>Uploaded At</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file._id}>
              <td>{file.originalname}</td>
              <td>{file.mimetype}</td>
              <td>{file.size}</td>
              <td>{new Date(file.uploadedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FileList;