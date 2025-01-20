"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import axios from "axios";
import markdownit from "markdown-it";
const md = markdownit();
const StartupForm = () => {
  const [advice, setadvice] = useState<string | null>(null);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const legalProblem = formData.get("legalProblem") as string;

    console.log("Legal Problem:", legalProblem);

    const result = await axios.post("/api/legaladvice", {
      prompt: legalProblem,
    });
console.log(result);
    // Set the advice from the API response
    setadvice(result?.data?.response?.candidates[0]?.content?.parts[0]?.text || null);
  };
  return (
    <form onSubmit={handleFormSubmit} className="startup-form">
      <div>
        <label htmlFor="legalProblem" className="startup-form_label">
          Describe Your Legal Problem
        </label>
        <Textarea
          id="legalProblem"
          name="legalProblem"
          className="startup-form_textarea"
          required
          placeholder="Briefly describe your legal issue or concern"
        />
      </div>

      <Button type="submit" className="startup-form_btn text-white">
        Submit for Legal Advice
        <Send className="size-6 ml-2" />
      </Button>
      
      <div>
        {advice ? (
          // Parse and render Markdown content dynamically
          <article
            className="prose max-w-4xl font-work-sans break-all"
            dangerouslySetInnerHTML={{ __html: md.render(advice) }}
          />
        ) : (
          <p className="no-result">No details provided</p>
        )}
      </div>
    </form>
  );
};

export default StartupForm;
