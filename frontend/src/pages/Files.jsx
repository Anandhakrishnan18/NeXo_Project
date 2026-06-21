import Layout from "../components/Layout";
import "../styles/files.css";

function Files() {
  return (
    <Layout>

      <div className="files-header">

        <div>
          <h1>Files</h1>
          <p>
            All files shared across your teams.
          </p>
        </div>

        <button className="primary-btn">
          Upload File
        </button>

      </div>

      <input
        className="file-search"
        placeholder="Search files..."
      />

      <div className="files-empty">

        <h3>No files</h3>

        <p>
          Upload a file to get started.
        </p>

      </div>

    </Layout>
  );
}

export default Files;