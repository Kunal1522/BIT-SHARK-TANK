"use client";

import React, { useState } from "react";
import axios from "axios";
import markdownit from "markdown-it";
const md = markdownit();

const LegalAdviceForm = () => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const legalProblem = formData.get("legalProblem") as string;

    console.log("Legal Problem:", legalProblem);

    try {
      const result = await axios.post("/api/legaladvice", {
        prompt: legalProblem,
      });

      setAdvice(result?.data?.response?.candidates[0]?.content?.parts[0]?.text || null);
    } catch (error) {
      console.error("Error fetching advice:", error);
      setAdvice("We regret to inform you that the counsel cannot process your request at this time.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section style={styles.container}>
      <h1 style={styles.title}>Legal Counsel Charter</h1>
      <form onSubmit={handleFormSubmit} style={styles.form}>
        <label htmlFor="legalProblem" style={styles.label}>
          State Your Legal Concern
        </label>
        <textarea
          id="legalProblem"
          name="legalProblem"
          style={styles.textarea}
          required
          placeholder="Compose your legal query in a formal manner"
        />
        <button
          type="submit"
          style={{
            ...styles.button,
            backgroundColor: isSubmitting ? "#d4b88e" : "#8b5e3c",
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit for Counsel"}
        </button>
      </form>
      <div style={styles.result}>
        {advice ? (
          <article
            style={styles.article}
            dangerouslySetInnerHTML={{ __html: md.render(advice) }}
          />
        ) : (
          <p style={styles.placeholder}>Awaiting your submission...</p>
        )}
      </div>
    </section>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    padding: "20px",
    background: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 800 600%22><rect width=%22800%22 height=%22600%22 fill=%22%23f9f0d9%22/><path stroke=%22%23bfa67a%22 stroke-width=%221%22 d=%22M0 0H800V600H0z%22/></svg>')",
    backgroundSize: "cover",
    fontFamily: "'Merriweather', serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: "2.5rem",
    color: "#5a3d31",
    marginBottom: "20px",
    textShadow: "2px 2px #bfa67a",
    fontWeight: "bold",
    borderBottom: "3px solid #bfa67a",
    paddingBottom: "10px",
  },
  form: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#f9f0d9",
    padding: "20px",
    borderRadius: "10px",
    border: "2px solid #bfa67a",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
  },
  label: {
    display: "block",
    fontSize: "1.2rem",
    color: "#5a3d31",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "10px",
    fontSize: "1rem",
    color: "#5a3d31",
    borderRadius: "5px",
    border: "1px solid #bfa67a",
    background: "#fefcf5",
    resize: "none",
    fontFamily: "'Merriweather', serif",
  },
  button: {
    display: "block",
    width: "100%",
    padding: "12px 15px",
    fontSize: "1.1rem",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    marginTop: "10px",
    fontWeight: "bold",
  },
  result: {
    marginTop: "20px",
    width: "100%",
    maxWidth: "600px",
    padding: "15px",
    backgroundColor: "#f9f0d9",
    borderRadius: "10px",
    border: "2px solid #bfa67a",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
  },
  article: {
    fontSize: "1.1rem",
    color: "#5a3d31",
    whiteSpace: "pre-wrap",
    fontStyle: "italic",
  },
  placeholder: {
    fontSize: "1rem",
    color: "#5a3d31",
  },
};

export default LegalAdviceForm;
