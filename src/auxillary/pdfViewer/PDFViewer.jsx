import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { getMaterialFile } from "../../services/materialService";

import "./pdfViewer.css";

//  configure pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL (
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url).toString();

    export default function PDFViewer({ material, token, onClose }) {

        const [pdfUrl, setPdfUrl] = useState(null);
        const [numPages, setNumPages] = useState(0);
        const [pageNumber, setPageNumber] = useState(1);
        const [scale, setScale] = useState(1);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");

        // retrieve pdf from backend
        useEffect(() => {
            let objectUrl;

            const loadPDF = async () => {
                try {
                    setLoading(true);
                    setError("");

                    const blob = await getMaterialFile(token, material);

                    if (!blob.type.includes("pdf")) {
                        throw new Error("The selected file is not a valid PDF");
                    }
                    objectUrl = URL.createObjectURL(blob);
                    setPdfUrl(objectUrl);

                } catch (err) {
                    setError(err.message || "Unable to load pdf");
                } finally {
                    setLoading(false);
                }
            };

            loadPDF();

            return () => {
                if (objectUrl) {
                    URL.revokeObjectURL(objectUrl);
                }
            };
        }, [material, token]);

        const handleDocumentLoad = ({ numPages }) => {
            setNumPages(numPages);
            setPageNumber(1);
        };
        const previousPage = () => {
            setPageNumber((prev) => Math.max(prev - 1, 1));
        };
        const nextPage = () => {
            setPageNumber((prev) => Math.min(prev + 1, numPages));
        };
        const zoomIn = () => {
            setScale((prev) => Math.min(prev + 0.2, 2.5));
        };
        const zoomOut = () => {
            setScale((prev) => Math.max(prev - 0.2, 0.6));
        };

        return (
            <div className="pdf-viewer-overlay">
                <div className="pdf-viewer-modal">

                    {/* Header */}
                    <div className="pdf-viewer-header">
                        <h2>{material.title}</h2>
                        <button type="button"
                            onClick={onClose}
                            className="pdf-close-btn"
                        >
                            x
                        </button>
                    </div>

                    {/* Toolbar */}
                    <div className="pdf-toolbar">
                        <div className="pdf-page-controls">
                            <button type="button"
                                onClick={previousPage}
                                disabled={pageNumber <= 1 || loading}
                            >
                                Previous
                            </button>

                            <span>Page {pageNumber} / {numPages || "-"}</span>

                            <button type="button"
                                onClick={nextPage}
                                disabled={pageNumber >= numPages || loading}
                            >
                                Next
                            </button>
                        </div>

                        <div className="pdf-zoom-controls">
                            <button type="button"
                                onCanPlay={zoomOut}
                                disabled={loading}
                            >
                                _
                            </button>

                            <span>{Math.round(scale * 100)}%</span>

                            <button type="button"
                                onClick={zoomIn}
                                disabled={loading}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* PDF content */}
                    <div className="pdf-viewer-content">
{/* 
                        {loading && (
                            <p>Loading PDF...</p>
                        )}
                        {error && (
                            <p className="pdf-error">{error}</p>
                        )}
                        {pdfUrl && !error && (
                            <Document>
                                <Page scale={scale}
                                    pageNumber={pageNumber}
                                    renderTextLayer={true}
                                    renderAnnotationLayer={true}
                                />
                            </Document>
                        )} */}
                        <Document
                            file={pdfUrl}
                            onLoadSuccess={({ numPages }) => {
                                console.log("PDF loaded successfully. Pages:", numPages);
                                setNumPages(numPages);
                            }}
                            onLoadError={(error) => {
                                console.error("PDF loading error:", error);
                            }}
                            loading={<p>Loading PDF...</p>}
                            error={<p>Unable to display PDF.</p>}
                        >
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                onRenderSuccess={() => {
                                    console.log("PDF page rendered successfully.");
                                }}
                                onRenderError={(error) => {
                                    console.error("PDF page rendering error:", error);
                                }}
                            />
                        </Document>
                    </div>
                </div>
            </div>
        );
    }

