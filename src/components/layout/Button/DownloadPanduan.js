import React from 'react';
import { saveAs } from 'file-saver';
import { Button } from 'antd';

const DownloadButton = () => {
    const handleDownload = () => {
        const pdfFilePath = '../../../assets/Buku Panduan.pdf';

        // Fetch the PDF file
        fetch(pdfFilePath)
            .then(response => response.blob())
            .then(blob => {
                // Use FileSaver.js to save the blob as a PDF file
                saveAs(blob, 'downloaded-file.pdf');
            })
            .catch(error => {
                console.error('Error downloading the file:', error);
            });
    };

    return (
        <div>
            <Button onClick={handleDownload}>Download PDF</Button>
        </div>
    );
};

export default DownloadButton;



