import React from "react";

export const metadata = {
  title: "SkillLens | Smart Resume Analyzer & Role Matching",
  description:
    "Analyze your resume, match job roles, and discover missing skills with SkillLens.",
};

export default function Home() {
  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.nav}>
        <div style={styles.container}>
          <div style={styles.navInner}>
            <h2 style={{ margin: 0 }}>SkillLens</h2>

            <div style={styles.navActions}>
              <a href="/upload" style={styles.primaryNavBtn}>
                Analyze
              </a>

              <a href="/editor" style={styles.secondaryNavBtn}>
                Edit Resume
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.container}>
          <h1 style={styles.heroTitle}>
            See Your Resume Clearly
            <br />
            Improve Your Career Direction
          </h1>

          <p style={styles.heroDesc}>
            SkillLens analyzes your resume, matches job roles, and helps you identify missing skills.
          </p>

          <a href="/upload">
            <button style={styles.primaryBtn}>Analyze Resume</button>
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>🧠 What SkillLens Does</h2>

          <div style={styles.grid}>
            <Card title="📊 Resume Score" desc="Understand your resume strength." />
            <Card title="🎯 Role Matching" desc="Find your best-fit job roles." />
            <Card title="❌ Skill Gaps" desc="See what skills you are missing." />
            <Card title="💡 Suggestions" desc="Improve your resume instantly." />
          </div>
        </div>
      </section>

      {/* ROLE PREVIEW */}
      <section style={{ ...styles.section, background: "#f9fafb" }}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>🎯 Role Match Preview</h2>

          <div style={styles.roleGrid}>
            {roles.map((r) => (
              <div key={r.role} style={styles.roleCard}>
                <p>{r.role}</p>
                <h3>{r.score}%</h3>

                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${r.score}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <div style={styles.container}>
          <h2>Improve Your Resume with SkillLens</h2>
          <p>Clear insights. Better opportunities.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <h3>SkillLens</h3>

          <p style={{ marginTop: "10px" }}>
            Smart resume analysis tool for better career decisions.
          </p>

          <div style={styles.footerLinks}>
            <a href="/upload">Analyze</a>
            <a href="/editor">Edit Resume</a>
          </div>

          <p style={{ marginTop: "20px", fontSize: "13px", color: "#888" }}>
            © 2026 SkillLens
          </p>
        </div>
      </footer>
    </div>
  );
}

/* COMPONENT */

type CardProps = {
  title: string;
  desc: string;
};

function Card({ title, desc }: CardProps) {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p style={{ color: "#555", fontSize: "14px" }}>{desc}</p>
    </div>
  );
}

/* DATA */

const roles = [
  { role: "Frontend Developer", score: 78 },
  { role: "Backend Developer", score: 65 },
  { role: "Cloud Engineer", score: 52 },
  { role: "Software Engineer", score: 82 },
];

/* STYLES */

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: "Inter, sans-serif",
    background: "#fff",
    color: "#111",
  },

  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "0 20px",
  },

  nav: {
    borderBottom: "1px solid #eee",
  },

  navInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 0",
  },

  navActions: {
    display: "flex",
    gap: "10px",
  },

  primaryNavBtn: {
    background: "#2563eb",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "6px",
    textDecoration: "none",
  },

  secondaryNavBtn: {
    background: "#16a34a",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "6px",
    textDecoration: "none",
  },

  hero: {
    padding: "90px 0",
    textAlign: "center",
  },

  heroTitle: {
    fontSize: "40px",
    fontWeight: "700",
  },

  heroDesc: {
    marginTop: "15px",
    fontSize: "18px",
    color: "#555",
  },

  primaryBtn: {
    marginTop: "25px",
    padding: "12px 28px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
  },

  section: {
    padding: "70px 0",
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: "28px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  },

  card: {
    padding: "20px",
    border: "1px solid #eee",
    borderRadius: "10px",
  },

  roleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  },

  roleCard: {
    padding: "20px",
    border: "1px solid #eee",
    borderRadius: "10px",
  },

  progressBar: {
    height: "8px",
    background: "#eee",
    borderRadius: "5px",
    marginTop: "10px",
  },

  progressFill: {
    height: "100%",
    background: "#2563eb",
    borderRadius: "5px",
  },

  cta: {
    padding: "70px 0",
    textAlign: "center",
    background: "#f3f4f6",
  },

  footer: {
    padding: "50px 0",
    textAlign: "center",
    background: "#111",
    color: "#aaa",
  },

  footerLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "15px",
  },
};