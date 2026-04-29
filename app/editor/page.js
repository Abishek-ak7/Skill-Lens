'use client';

export default function ComingSoonPage() {
  return (
    <div style={styles.container}>
      
      <div style={styles.card}>
        <h1 style={styles.title}>🚧 Coming Soon</h1>
        
        <p style={styles.subtitle}>
          We're working on something awesome.
        </p>

        <p style={styles.description}>
          This Resume Builder feature will be available shortly.
          Stay tuned!
        </p>

        <div style={styles.loader}></div>
      </div>

    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #3b82f6, #9333ea)",
    fontFamily: "Inter, sans-serif",
  },

  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    maxWidth: "400px",
    width: "90%",
  },

  title: {
    fontSize: "32px",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "18px",
    color: "#555",
  },

  description: {
    marginTop: "10px",
    color: "#777",
    fontSize: "14px",
  },

  loader: {
    margin: "20px auto 0",
    width: "40px",
    height: "40px",
    border: "4px solid #eee",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

/* Add this globally (important) */
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}