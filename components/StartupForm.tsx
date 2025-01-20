"use client";
import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";
const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };

      await formSchema.parseAsync(formValues);
      const result = await createPitch(prevState, formData, pitch);

      if (result.status == "SUCCESS") {
        toast({
          title: "Success",
          description: "Your startup pitch has been created successfully",
        });

        router.push(`/startup/${result._id}`);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;

        setErrors(fieldErrors as unknown as Record<string, string>);

        toast({
          title: "Error",
          description: "Please check your inputs and try again",
          variant: "destructive",
        });

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast({
        title: "Error",
        description: "An unexpected error has occurred",
        variant: "destructive",
      });

      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <>
      <div className="golden-section">
        <h1 className="text-4xl font-bold text-white animate-bounce">
          Submit Your Startup Idea
        </h1>
      </div>

      <form
        action={formAction}
        className="startup-form bg-glass p-10 rounded-lg shadow-xl"
      >
        <h1 className="text-center text-3xl font-bold text-white mb-8">
       
        </h1>

        <div className="mb-6">
          <label htmlFor="title" className="startup-form_label text-white">
            Title
          </label>
          <Input
            id="title"
            name="title"
            className="startup-form_input"
            required
            placeholder="Startup Title"
          />
          {errors.title && <p className="startup-form_error">{errors.title}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="startup-form_label text-white">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            className="startup-form_textarea"
            required
            placeholder="Startup Description"
          />
          {errors.description && (
            <p className="startup-form_error">{errors.description}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="category" className="startup-form_label text-white">
            Category
          </label>
          <Input
            id="category"
            name="category"
            className="startup-form_input"
            required
            placeholder="Startup Category (Tech, Health, Education...)"
          />
          {errors.category && (
            <p className="startup-form_error">{errors.category}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="link" className="startup-form_label text-white">
            Image URL
          </label>
          <Input
            id="link"
            name="link"
            className="startup-form_input"
            required
            placeholder="Startup Image URL"
          />
          {errors.link && <p className="startup-form_error">{errors.link}</p>}
        </div>

        <div data-color-mode="light" className="mb-6">
          <label htmlFor="pitch" className="startup-form_label text-white">
            Pitch
          </label>
          <MDEditor
            value={pitch}
            onChange={(value) => setPitch(value as string)}
            id="pitch"
            preview="edit"
            height={300}
            style={{
              borderRadius: 20,
              overflow: "hidden",
              backgroundColor: "#1a1a1a",
              color: "white",
            }}
            textareaProps={{
              placeholder:
                "Briefly describe your idea and what problem it solves",
            }}
            previewOptions={{
              disallowedElements: ["style"],
            }}
          />
          {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
        </div>

        <Button
          type="submit"
          className="startup-form_btn"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Submit Your Pitch"}
          <Send className="size-6 ml-2" />
        </Button>
      </form>

      <style jsx>{`
        body {
          background: linear-gradient(to bottom, #0f0f0f, #1c1c1c);
          color: white;
          font-family: "Helvetica Neue", Arial, sans-serif;
          padding: 0;
          margin: 0;
          overflow-x: hidden;
        }

        .golden-section {
          background: linear-gradient(120deg, #8c7000, #1a1a1a);
          height: 300px;
          display: flex;
          justify-content: center;
          align-items: center;
          animation: goldenGlow 5s infinite alternate;
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        }

        @keyframes goldenGlow {
          0% {
            background: linear-gradient(120deg, #8c7000, #1a1a1a);
            transform: scale(1);
          }
          50% {
            background: linear-gradient(120deg, #ffd700, #1a1a1a);
            transform: scale(1.05);
          }
          100% {
            background: linear-gradient(120deg, #8c7000, #1a1a1a);
            transform: scale(1);
          }
        }

        .startup-form {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 30px;
          margin: -120px auto 0;
          max-width: 600px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease-in-out, box-shadow 0.3s;
        }

        .startup-form:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        }

        .startup-form_label {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .startup-form_input,
        .startup-form_textarea {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          transition: border 0.2s ease-in-out;
        }

        .startup-form_input:focus,
        .startup-form_textarea:focus {
          border: 1px solid #ffd700;
        }

        .startup-form_btn {
          cursor: pointer;
          transition: transform 0.3s ease-in-out;
          background: linear-gradient(to right, #ffd700, #ffc700);
        }

        .startup-form_btn:hover {
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
};

export default StartupForm;
