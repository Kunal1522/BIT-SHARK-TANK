"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import markdownit from "markdown-it";
import { PulseLoader } from "react-spinners"; // Importing PulseLoader spinner
const md = markdownit();

const PitchPage = () => {
  const [advice, setadvice] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [recognitionInstance, setRecognitionInstance] = useState<SpeechRecognition | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state for Gemini AI response

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
      setIsLoading(true); // Start loading spinner

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
        setIsLoading(false); // Stop loading spinner
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
    <section className="flex flex-col justify-center items-center min-h-[calc(100vh-3rem)] relative bg-gradient-to-r from-blue-800 to-teal-600 p-6 rounded-lg shadow-xl">
      <h1 className="text-white text-3xl font-bold mb-6 text-center">Want to Pitch?</h1>

      <button
        onClick={handleStartRecording}
        className={`transition-transform duration-300 mb-6 p-3 rounded-full text-white font-semibold bg-gradient-to-r from-blue-400 to-blue-600 ${
          isRecording ? "scale-95 opacity-80" : "hover:scale-105"
        }`}
      >
        <span>{isRecording ? "Recording..." : "Start Recording"}</span>
      </button>

      <button
        onClick={handleSubmitPitch}
        className={`transition-all duration-300 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-8 rounded-lg mb-6 shadow-lg ${
          isSubmitting || !transcribedText ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
        }`}
        disabled={isSubmitting || !transcribedText}
      >
        {isSubmitting ? (
          <>
            Submitting... <PulseLoader size={8} color="#fff" />
          </>
        ) : (
          "Submit Pitch"
        )}
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md text-gray-900 mb-6 max-w-3xl w-full">
        <h2 className="font-semibold text-xl mb-4">Your Pitch:</h2>
        <p>{transcribedText}</p>
      </div>

      <button
        onClick={handleReset}
        className="bg-red-500 text-white py-3 px-8 rounded-lg shadow-lg hover:scale-105 mb-6"
      >
        Reset
      </button>

      {/* Show loading spinner while waiting for Gemini AI response */}
      {isLoading && (
        <div className="flex justify-center items-center mt-6">
          <PulseLoader size={16} color="#fff" />
        </div>
      )}

      <div>
        {advice ? (
          <article className="prose max-w-4xl font-work-sans break-all" dangerouslySetInnerHTML={{ __html: md.render(advice) }} />
        ) : (
          <p className="no-result text-white">No details provided</p>
        )}
      </div>
    </section>
  );
};

export default PitchPage;
