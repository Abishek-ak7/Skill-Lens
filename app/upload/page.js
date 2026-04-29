'use client';

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // ✅ NEW STATE
  const [emailStatus, setEmailStatus] = useState(null);
  // null | "loading" | "success" | "error"

  // =========================
  // 📂 HANDLE FILE
  // =========================
  const handleFile = (f) => {
    if (!f || f.type !== "application/pdf") {
      alert("Only PDF files allowed");
      return;
    }
    setFile(f);
    setEmailStatus(null); // reset status if new file
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // =========================
  // 🚀 AI ANALYZE
  // =========================
  const handleUpload = async () => {
    if (!file) return alert("Please upload a file");

    setLoading(true);
    setData(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!result.success) {
        alert(result.error || "Something went wrong");
        setLoading(false);
      } else {
        setTimeout(() => {
          setData(result);
          setLoading(false);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
      setLoading(false);
    }
  };

  // =========================
  // 📧 SEND EMAIL (UPDATED)
  // =========================
  const handleSendEmail = async () => {
    if (!file) return alert("Upload resume first");

    setEmailStatus("loading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        body: formData,
      });

      // 🔥 Prevent JSON crash
      if (!res.ok) {
        const text = await res.text();
        console.error("Server Error:", text);
        setEmailStatus("error");
        return;
      }

      const result = await res.json();

      if (result.success) {
        setEmailStatus("success");
      } else {
        setEmailStatus("error");
      }

    } catch (err) {
      console.error(err);
      setEmailStatus("error");
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#16a34a";
    if (score >= 60) return "#f59e0b";
    return "#dc2626";
  };

  return (
    <div style={styles.page}>

      {/* HERO */}
      <div style={styles.hero}>
        <h1 style={styles.title}>🚀 Analyze Your Resume</h1>
        <p style={styles.subtitle}>
          Upload your resume and get AI-powered insights
        </p>

        {/* DROP ZONE */}
        <div
          style={{
            ...styles.dropZone,
            borderColor: dragActive ? "#2563eb" : "#ddd",
            background: dragActive ? "#f0f7ff" : "#fff",
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFile(e.target.files[0])}
            style={styles.hiddenInput}
            id="fileUpload"
          />

          <label htmlFor="fileUpload" style={{ cursor: "pointer" }}>
            <div style={styles.uploadContent}>
              <div style={styles.icon}>📄</div>
              <p><strong>Click to upload</strong> or drag & drop</p>
              <p style={{ fontSize: "13px", color: "#666" }}>
                PDF only (Max 5MB)
              </p>
            </div>
          </label>
        </div>

        {/* FILE PREVIEW */}
        {file && (
          <div style={styles.filePreview}>
            <span>📎 {file.name}</span>
            <span>{(file.size / 1024).toFixed(1)} KB</span>
          </div>
        )}

        {/* ANALYZE BUTTON */}
        <button onClick={handleUpload} style={styles.button}>
          Analyze Resume
        </button>

        {/* EMAIL CTA */}
        <p style={{ marginTop: "15px", color: "#555" }}>
          Want a detailed human review? Send your resume directly.
        </p>

        {/* SEND BUTTON */}
        <button
          onClick={handleSendEmail}
          disabled={emailStatus === "loading" || emailStatus === "success"}
          style={{
            ...styles.button,
            background:
              emailStatus === "loading"
                ? "#94a3b8"
                : "#16a34a",
          }}
        >
          {emailStatus === "loading"
            ? "Sending..."
            : emailStatus === "success"
            ? "Submitted ✅"
            : "📧 Send Resume for Manual Review"}
        </button>

        {/* SUCCESS / ERROR UI */}
        {emailStatus === "success" && (
          <div style={styles.successBox}>
            ✅ Resume successfully submitted for review!
          </div>
        )}

        {emailStatus === "error" && (
          <div style={styles.errorBox}>
            ❌ Failed to send resume. Try again.
          </div>
        )}

      </div>

      {/* LOADING */}
      {loading && (
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          <h2>Analyzing Resume...</h2>
          <p>Extracting skills & matching roles</p>
        </div>
      )}

      {/* RESULTS */}
      {data && !loading && (
        <div style={styles.grid}>

          <div style={styles.column}>
            <div style={styles.card}>
              <h2>📊 Overall Score</h2>
              <h1 style={{ color: getScoreColor(data.score) }}>
                {data.score}/100
              </h1>
            </div>

            <div style={styles.highlightCard}>
              <h3>🏆 Best Role</h3>
              <h2>{data.roleScores[0].role}</h2>
              <p>{data.roleScores[0].score}% match</p>
            </div>

            <div style={styles.card}>
              <h3>💡 Suggestions</h3>
              {data.suggestions.map((s, i) => (
                <div key={i} style={styles.suggestion}>{s}</div>
              ))}
            </div>
          </div>

          <div style={styles.column}>
            <div style={styles.card}>
              <h3>🎯 Role Breakdown</h3>

              {data.roleScores.map((role, i) => (
                <div key={role.role} style={styles.roleBlock}>
                  <div style={styles.roleHeader}>
                    <span>{i === 0 ? "🏆 " : ""}{role.role}</span>
                    <strong>{role.score}%</strong>
                  </div>

                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${role.score}%`,
                        background: getScoreColor(role.score),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.card}>
              <h3>📄 Resume Preview</h3>
              <div style={styles.preview}>{data.preview}</div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

/* STYLES */

const styles = {
  page: {
    padding: "20px",
    maxWidth: "1100px",
    margin: "auto",
    fontFamily: "Inter, sans-serif",
  },
  hero: { textAlign: "center", marginBottom: "30px" },
  title: { fontSize: "36px", fontWeight: "700" },
  subtitle: { color: "#666", marginBottom: "20px" },

  dropZone: {
    border: "2px dashed #ddd",
    borderRadius: "12px",
    padding: "40px",
    marginBottom: "15px",
  },

  hiddenInput: { display: "none" },

  uploadContent: { textAlign: "center" },

  icon: { fontSize: "40px", marginBottom: "10px" },

  filePreview: {
    marginTop: "10px",
    padding: "10px",
    border: "1px solid #eee",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
  },

  button: {
    marginTop: "15px",
    padding: "12px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
  },

  successBox: {
    marginTop: "15px",
    padding: "12px",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "8px",
    fontWeight: "500",
  },

  errorBox: {
    marginTop: "15px",
    padding: "12px",
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: "8px",
    fontWeight: "500",
  },

  loadingBox: { textAlign: "center", marginTop: "40px" },

  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #eee",
    borderTop: "5px solid #2563eb",
    borderRadius: "50%",
    margin: "auto",
    animation: "spin 1s linear infinite",
  },

  grid: { display: "flex", gap: "20px", flexWrap: "wrap" },
  column: { flex: "1", minWidth: "300px" },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    marginBottom: "20px",
  },

  highlightCard: {
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    color: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    textAlign: "center",
  },

  suggestion: {
    padding: "10px",
    marginBottom: "8px",
    background: "#fff7ed",
    borderLeft: "4px solid #f97316",
    borderRadius: "6px",
  },

  roleBlock: { marginBottom: "15px" },

  roleHeader: {
    display: "flex",
    justifyContent: "space-between",
  },

  progressBar: {
    height: "8px",
    background: "#eee",
    borderRadius: "5px",
    marginTop: "10px",
  },

  progressFill: {
    height: "100%",
    borderRadius: "5px",
  },

  preview: {
    maxHeight: "200px",
    overflow: "auto",
    background: "#f3f4f6",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "13px",
  },
};