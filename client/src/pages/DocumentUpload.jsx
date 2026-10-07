import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const DocumentUpload = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [documentType, setDocumentType] = useState(
    "IDENTITY_PROOF"
  );
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  setMessage("");
  setError("");

  if (!file) {
    setError("Please select a document");
    return;
  }

  const formData = new FormData();

  formData.append("applicationId", id);
  formData.append("documentType", documentType);
  formData.append("document", file);

  setLoading(true);

  try {
    const response = await api.post(
      "/documents/upload",
      formData
    );

    console.log("UPLOAD SUCCESS:", response.data);

    setMessage("Document uploaded successfully");

    // File state clear
    setFile(null);

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    setError(
      error.response?.data?.message ||
        error.message ||
        "Document upload failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <button
        onClick={() =>
          navigate(`/applications/${id}`)
        }
      >
        ← Back to Application
      </button>

      <h1>Upload Document</h1>

      <p>
        <strong>Application ID:</strong> {id}
      </p>

      {message && <p>{message}</p>}

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Document Type
          </label>

          <select
            value={documentType}
            onChange={(e) =>
              setDocumentType(e.target.value)
            }
          >
            <option value="IDENTITY_PROOF">
              Identity Proof
            </option>

            <option value="INCOME_CERTIFICATE">
              Income Certificate
            </option>

            <option value="EDUCATION_CERTIFICATE">
              Education Certificate
            </option>

            <option value="RESIDENCE_PROOF">
              Residence Proof
            </option>

            <option value="OTHER">
              Other
            </option>
          </select>
        </div>

        <br />

        <div>
          <label>
            Select Document
          </label>

          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
          />
        </div>

        <br />

        <p>
          Allowed: PDF, JPG, PNG | Maximum size: 5 MB
        </p>

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Document"}
        </button>
      </form>
    </div>
  );
};

export default DocumentUpload;