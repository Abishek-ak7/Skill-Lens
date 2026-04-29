export const runtime = "nodejs";

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdf = require("pdf-parse");
    const result = await pdf(buffer);

    // =========================
    // 🧠 CLEAN TEXT
    // =========================
    function cleanText(text) {
      return text.replace(/\n+/g, " ").replace(/\s+/g, " ").toLowerCase();
    }

    const clean = cleanText(result.text);

    // =========================
    // 📂 SPLIT SECTIONS
    // =========================
    function splitSections(text) {
      return {
        project: text.split("project")[1] || "",
        experience: text.split("experience")[1] || "",
        skills: text.split("skill")[1] || "",
      };
    }

    const sectionsText = splitSections(clean);

    // =========================
    // 🛠 ESCAPE REGEX
    // =========================
    function escapeRegex(text) {
      return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function matchKeyword(text, keyword) {
      const regex = new RegExp(`\\b${escapeRegex(keyword)}\\b`, "i");
      return regex.test(text);
    }

    // =========================
    // 🎯 ROLE CONFIG (CORE + SECONDARY)
    // =========================
    const roleConfig = {
      "SDE": {
        core: ["data structures", "algorithms", "problem solving"],
        secondary: ["java", "python", "c++", "oop", "system design"]
      },

      "Frontend Developer": {
        core: ["html", "css", "javascript"],
        secondary: ["react", "next.js", "redux", "tailwind", "ui", "ux"]
      },

      "Backend Developer": {
        core: ["node", "api", "database"],
        secondary: ["express", "mongodb", "sql", "rest api", "jwt"]
      },

      "Java Backend Developer": {
        core: ["java", "spring boot"],
        secondary: ["hibernate", "microservices", "rest api"]
      },

      "Cloud Engineer": {
        core: ["aws", "docker"],
        secondary: ["kubernetes", "azure", "gcp", "ci/cd"]
      },

      "Security Engineer": {
        core: ["cybersecurity", "network security"],
        secondary: ["penetration testing", "kali linux", "siem"]
      }
    };

    // =========================
    // 🎯 ADVANCED SCORING
    // =========================
    function calculateRoleScore(role, config) {
      let score = 0;
      let maxScore = 0;

      let matched = [];
      let missing = [];

      // CORE (high importance)
      config.core.forEach((kw) => {
        maxScore += 30;

        const inProject = matchKeyword(sectionsText.project, kw);
        const inExp = matchKeyword(sectionsText.experience, kw);
        const inSkills = matchKeyword(sectionsText.skills, kw);

        if (inProject) score += 30;
        else if (inExp) score += 20;
        else if (inSkills) score += 15;
        else {
          score -= 10; // ❌ penalty
          missing.push(kw);
        }

        if (inProject || inExp || inSkills) {
          matched.push(kw);
        }
      });

      // SECONDARY (lower importance)
      config.secondary.forEach((kw) => {
        maxScore += 10;

        const inProject = matchKeyword(sectionsText.project, kw);
        const inExp = matchKeyword(sectionsText.experience, kw);
        const inSkills = matchKeyword(sectionsText.skills, kw);

        if (inProject) score += 10;
        else if (inExp) score += 8;
        else if (inSkills) score += 5;
        else {
          missing.push(kw);
        }

        if (inProject || inExp || inSkills) {
          matched.push(kw);
        }
      });

      let finalScore = Math.max(0, Math.round((score / maxScore) * 100));

      return {
        role,
        score: finalScore,
        matchedKeywords: matched,
        missingKeywords: missing,
        matchedCount: matched.length,
        total: config.core.length + config.secondary.length
      };
    }

    // =========================
    // 🎯 ALL ROLE SCORES
    // =========================
    const roleScores = Object.keys(roleConfig)
      .map(role => calculateRoleScore(role, roleConfig[role]))
      .sort((a, b) => b.score - a.score);

    // =========================
    // 📊 BASIC ATS SCORE
    // =========================
    const score = Math.min(
      100,
      Math.round(
        roleScores[0].score * 0.7 +
        roleScores[1]?.score * 0.3
      )
    );

    // =========================
    // 💡 SUGGESTIONS
    // =========================
    function generateSuggestions() {
      let bestRole = roleScores[0];

      let suggestions = [];

      if (bestRole.missingKeywords.length > 0) {
        suggestions.push(
          `To improve for ${bestRole.role}, learn: ${bestRole.missingKeywords.slice(0, 3).join(", ")}`
        );
      }

      if (!clean.includes("project")) {
        suggestions.push("Add strong real-world projects.");
      }

      if (!clean.includes("experience")) {
        suggestions.push("Add internship or experience.");
      }

      return suggestions;
    }

    const suggestions = generateSuggestions();

    // =========================
    // 📤 RESPONSE
    // =========================
    return Response.json({
      success: true,
      score,
      roleScores,
      suggestions,
      preview: clean.substring(0, 500),
    });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Parsing failed" }, { status: 500 });
  }
}