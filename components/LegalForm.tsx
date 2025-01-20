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
      setAdvice("Sorry, we couldn't process your request at the moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section style={styles.container}>
      <h1 style={styles.title}>Legal Advice Portal</h1>
      <form onSubmit={handleFormSubmit} style={styles.form}>
        <label htmlFor="legalProblem" style={styles.label}>
          Describe Your Legal Problem
        </label>
        <textarea
          id="legalProblem"
          name="legalProblem"
          style={styles.textarea}
          required
          placeholder="Briefly describe your legal issue or concern"
        />
        <button
          type="submit"
          style={{
            ...styles.button,
            backgroundColor: isSubmitting ? "#d9d2c5" : "#bc8f8f",
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit for Legal Advice"}
        </button>
      </form>
      <div style={styles.result}>
        {advice ? (
          <article
            style={styles.article}
            dangerouslySetInnerHTML={{ __html: md.render(advice) }}
          />
        ) : (
          <p style={styles.placeholder}>No details provided yet.</p>
        )}
      </div>
    </section>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    padding: "20px",
    background: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 800 600%22><rect width=%22800%22 height=%22600%22 fill=%22%23f3ecd6%22/><path stroke=%22%23d7c2a0%22 stroke-width=%221%22 d=%22M0 0H800V600H0z%22/></svg>')",
    backgroundSize: "cover",
    fontFamily: "'Georgia', serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: "2rem",
    color: "#5a3d31",
    marginBottom: "20px",
    textShadow: "1px 1px #d7c2a0",
  },
  form: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#f8f4e8",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  label: {
    display: "block",
    fontSize: "1rem",
    color: "#5a3d31",
    marginBottom: "10px",
  },
  textarea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    fontSize: "1rem",
    color: "#5a3d31",
    borderRadius: "5px",
    border: "1px solid #d7c2a0",
    background: "#fefefe",
    resize: "none",
  },
  button: {
    display: "block",
    width: "100%",
    padding: "10px 15px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#bc8f8f",
    border: "none",
    borderRadius: "5px",
    marginTop: "10px",
  },
  result: {
    marginTop: "20px",
    width: "100%",
    maxWidth: "600px",
    padding: "10px",
    backgroundColor: "#f8f4e8",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  article: {
    fontSize: "1rem",
    color: "#5a3d31",
    whiteSpace: "pre-wrap",
  },
  placeholder: {
    fontSize: "1rem",
    color: "#5a3d31",
  },
};

export default LegalAdviceForm;
