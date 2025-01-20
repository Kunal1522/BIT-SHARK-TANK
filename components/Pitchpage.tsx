

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import markdownit from "markdown-it";
const md = markdownit();
// TypeScript declaration for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof webkitSpeechRecognition;
  }
}

const PitchPage = () => {
  const [advice, setadvice] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [recognitionInstance, setRecognitionInstance] = useState<SpeechRecognition | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const initializeRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported in this browser.");
      return null;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    let finalTranscript = "";
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (event.results[event.results.length - 1].isFinal) {
        finalTranscript += " " + transcript.trim();
        setTranscribedText(finalTranscript);
        console.log("Final Transcribed Text:", finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      if (isRecording && !isSubmitting) {
        console.log("Recognition stopped but not reset.");
      }
    };

    return recognition;
  };

  const startAudio = async () => {
    try {
      if (stream) return;
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setStream(mediaStream);
    } catch (error) {
      console.error("Error accessing audio:", error);
    }
  };

  const stopAudio = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleStartRecording = () => {
    if (!isRecording) {
      const recognition = initializeRecognition();
      if (recognition) {
        setRecognitionInstance(recognition);
        recognition.start();
        console.log("Recording started...");
        startAudio();
        setIsRecording(true);
      }
    } else {
      if (recognitionInstance) {
        recognitionInstance.stop();
        console.log("Recording stopped.");
      }
      stopAudio();
      setIsRecording(false);
    }
  };

  const handleSubmitPitch = async () => {
    if (!isSubmitting && transcribedText) {
      setIsSubmitting(true);
      console.log("Submitting Pitch:", transcribedText);

      try {
        const result = await axios.post("/api/pitchGrader", {
          prompt: transcribedText,
        });
        setadvice(result?.data?.response?.candidates[0]?.content?.parts[0]?.text || null);
        alert("Pitch submitted successfully!");
      } catch (error) {
   
        console.error("Error submitting pitch:", error);
   
        alert("Failed to submit the pitch.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert("Please provide a pitch before submitting.");
    }
  };

  const handleReset = () => {
    setTranscribedText("");
    if (recognitionInstance) {
      recognitionInstance.stop();
      setIsRecording(false);
    }
    stopAudio();
    console.log("Pitch reset");
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <section className="flex flex-col justify-center items-center min-h-[calc(33vh)] relative bg-gradient-to p-4">
      <h1 className="heading text-white text-xl font-bold mb-4">Want to Pitch</h1>

      <button
        onClick={handleStartRecording}
        className={`transition-transform duration-500 mb-4 ${
          isRecording ? "-translate-y-2 scale-90 opacity-75" : ""
        }`}
      >
        <span className="text-black text-lg font-bold">
          {isRecording ? "Recording..." : "Start Recording"}
        </span>
      </button>

      <button
        onClick={handleSubmitPitch}
        className="bg-green-500 text-white py-2 px-4 rounded-lg mb-4"
        disabled={isSubmitting || !transcribedText}
      >
        {isSubmitting ? "Submitting..." : "Submit Pitch"}
      </button>

      <div className="bg-white p-4 rounded-lg shadow-md text-gray-800 mb-4">
        <h2 className="font-bold mb-2">Your Pitch:</h2>
        <p>{transcribedText}</p>
      </div>

      <button
        onClick={handleReset}
        className="bg-red-500 text-white py-2 px-4 rounded-lg"
      >
        Reset
      </button>
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
    </section>
  );
};

export default PitchPage;
