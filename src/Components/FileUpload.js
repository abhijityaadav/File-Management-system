import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5005/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage(response.data.message);
      setFile(null);
    } catch (error) {
      setMessage('File upload failed');
      console.error(error);
    }
  };

  return (
    <div className="upload-container">
      <h2>File Upload</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.pdf"
        />
        <button type="submit">Upload</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default FileUpload;