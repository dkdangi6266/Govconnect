import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const DocumentList = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDocuments = async () => {
    try {
      const response = await api.get(
        `/documents/application/${id}`
      );

      setDocuments(response.data.documents || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load documents"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [id]);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (loading) {
    return <p>Loading documents...</p>;
  }

  return (
    <div>
      <button
        onClick={() =>
          navigate(`/applications/${id}`)
        }
      >
        ← Back to Application
      </button>

      <h1>My Documents</h1>

      <p>
        <strong>Application ID:</strong> {id}
      </p>

      {error && <p>{error}</p>}

      {documents.length === 0 ? (
        <div>
          <p>No documents uploaded yet.</p>
        </div>
      ) : (
        documents.map((document) => (
          <div key={document._id}>
            <h2>{document.originalName}</h2>

            <p>
              <strong>Type:</strong>{" "}
              {document.documentType}
            </p>

            <p>
              <strong>Size:</strong>{" "}
              {formatFileSize(document.fileSize)}
            </p>

            <p>
              <strong>Format:</strong>{" "}
              {document.mimeType}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {document.verificationStatus}
            </p>

            <hr />
          </div>
        ))
      )}

      <button
        onClick={() =>
          navigate(`/applications/${id}/documents`)
        }
      >
        Upload New Document
      </button>
    </div>
  );
};

export default DocumentList;