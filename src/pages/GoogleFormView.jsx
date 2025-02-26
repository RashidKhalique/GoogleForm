import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const FormPage = () => {
  const [formData, setFormData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [image, setImage] = useState(null); // State to handle image file separately
  const [showPopup, setShowPopup] = useState(false);
  const baseUrl = "https://quizand-form-backend.vercel.app";
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/quiz/viewform/${id}`);
        setFormData(response.data.data.Form);
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchFormData();
  }, [id]);

  const handleInputChange = (id, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [id]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submittedAnswers = formData.questions.map((question) => ({
      question: question.question,
      type: question.type,
      answer: answers[question.id],
    }));

    const formDataToSend = new FormData();
    formDataToSend.append("formId", formData.id);
    formDataToSend.append("answers", JSON.stringify(submittedAnswers));
    formDataToSend.append("id", id);
    formDataToSend.append("submit", true);
    if (image) {
      formDataToSend.append("image", image);
    }

    try {
      const response = await axios.post(`${baseUrl}/api/quiz/submitForm`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Form submitted successfully!");
        setShowPopup(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response.data.message);
    }
  };

  if (!formData) {
    return <div className="text-center mt-10">Loading form...</div>;
  }

  const themeColor = formData.themeColor || "#6B46C1";

  return (
    <div className={`min-h-screen flex justify-center items-center bg-${themeColor}-600 p-6`}>
      <div className="bg-white shadow-lg rounded-lg p-6 w-11/12 max-w-3xl border border-gray-200">
        <h1 className={`text-2xl font-bold text-center mb-4 text-${themeColor}-600`}>
          {formData.quizTitle || "Form"}
        </h1>
        <p className={`text-center text-sm text-${themeColor}-600 mb-6`}>{formData.quizDescription || ""}</p>
        <form className="space-y-6 p-4" onSubmit={handleSubmit}>
          {formData.questions.map((question) => (
            <div key={question.id} className="mb-4">
              <label className={`block text-lg font-medium text-${themeColor}-600 mb-4`}>
                {question.question} {question.required ? <span className="text-red-500">*</span> : ""}
              </label>

              {question.type === "short_answer" && (
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                  placeholder="Your answer"
                  required={question.required}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                />
              )}

              {question.type === "paragraph" && (
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                  placeholder="Your answer"
                  required={question.required}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                />
              )}

              {question.type === "multiple_choice" && (
                <div className="space-y-2">
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md">
                      <input
                        type="radio"
                        id={`mcq-${question.id}-${index}`}
                        name={`mcq-${question.id}`}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                        required={question.required}
                        onChange={() => handleInputChange(question.id, option)}
                      />
                      <label htmlFor={`mcq-${question.id}-${index}`} className="text-sm text-gray-700">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {question.type === "checkbox" && (
                <div className="space-y-2">
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md">
                      <input
                        type="checkbox"
                        id={`checkbox-${question.id}-${index}`}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                        onChange={(e) =>
                          handleInputChange(question.id, {
                            ...answers[question.id],
                            [option]: e.target.checked,
                          })
                        }
                      />
                      <label htmlFor={`checkbox-${question.id}-${index}`} className="text-sm text-gray-700">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {question.type === "dropdown" && (
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                  required={question.required}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                >
                  <option value="">Select an option</option>
                  {question.options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {question.type === "file_upload" && (
                <input
                  type="file"
                  name="image"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required={question.required}
                  onChange={handleImageChange}
                />
              )}

              {question.type === "date" && (
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                  required={question.required}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                />
              )}

              {question.type === "time" && (
                <input
                  type="time"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                  required={question.required}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            className={`w-full bg-${themeColor}-600 `}
            style={{
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Submit
          </button>
        </form>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-cente flex items-center flex-col">
            <FaCheckCircle className="text-green-500 text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Thank you for submitting the form!</h3>
            <p className="text-gray-700 mb-4">Your response has been recorded successfully.</p>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={() => {
                setShowPopup(false);
                localStorage.removeItem("token");
                localStorage.removeItem("url");
                
                navigate("/");
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default FormPage;