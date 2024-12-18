import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FileDownload() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');

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

  const handleDownload = async () => {
    if (!selectedFile) {
      alert('Please select a file to download');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5005/api/files/download/${selectedFile}`, {
        responseType: 'blob'
      });

      const file = files.find(f => f._id === selectedFile);

      // Create a link to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.originalname);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Download failed', error);
    }
  };

  return (
    <div className="download-container">
      <h2>Download File</h2>
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
      <button onClick={handleDownload}>Download</button>
    </div>
  );
}

export default FileDownload;