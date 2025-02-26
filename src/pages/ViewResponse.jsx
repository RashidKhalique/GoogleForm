import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaPalette } from "react-icons/fa";

const ViewResponse = () => {
  const [submittedData, setSubmittedData] = useState(null);
  const [quizTitle, setQuizTitle] = useState("Untitled form");
  const [themeColor, setThemeColor] = useState("purple");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const baseUrl = "https://quizand-form-backend.vercel.app";
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const navigate = useNavigate();

  const themeStyles = {
    purple: { backgroundColor: "bg-purple-600", textColor: "text-purple-600" },
    blue: { backgroundColor: "bg-blue-600", textColor: "text-blue-600" },
    red: { backgroundColor: "bg-red-600", textColor: "text-red-600" },
    yellow: { backgroundColor: "bg-yellow-600", textColor: "text-yellow-600" },
  };

  useEffect(() => {
    const fetchSubmittedData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/quiz/submitview/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);

        const parsedAnswers = JSON.parse(response.data.submitform[0].answers);
        setSubmittedData({ ...response.data.submitform[0], answers: parsedAnswers });
        setQuizTitle(response.data.submitform[0]?.QuizName || "Untitled form");
      } catch (error) {
        console.error("Error fetching submitted data:", error);
      }
    };

    fetchSubmittedData();
  }, [id, token]);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const handleThemeChange = (e) => {
    setThemeColor(e.target.value);
  };

  return (
    <>
      <header
        className={`bg-white border-b px-4 py-4 w-full max-w-6xl mx-auto  ${themeStyles[themeColor]?.textColor || "text-gray-900"
          }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4" onClick={() => navigate('/home')}>
            <div
              className={`w-10 h-10 ${themeStyles[themeColor]?.backgroundColor || "bg-purple-600"
                } rounded`}
            ></div>
            <div className="flex flex-col">
              <p className="text-lg font-medium focus:outline-none cursor-pointer" placeholder="Untitled form">
                {quizTitle}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <span>All changes saved in Drive</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <div className="relative inline-block">
              <button
                onClick={toggleDropdown}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Select Theme"
              >
                <FaPalette className="w-5 h-5 text-gray-600" />
              </button>

              {dropdownVisible && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-300 z-50">
                  <select
                    id="theme-color"
                    value={themeColor}
                    onChange={handleThemeChange}
                    className="block w-full py-2 px-3 border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  >
                    <option value="purple">Purple</option>
                    <option value="blue">Blue</option>
                    <option value="red">Red</option>
                    <option value="yellow">Yellow</option>
                  </select>
                </div>
              )}
            </div>

            <button
              className={`px-6 py-2 rounded-md font-medium ${themeStyles[themeColor]?.backgroundColor || "bg-purple-600"
                } text-white`}
            >
              Publish
            </button>
          </div>
        </div>
      </header>

      <div
        className={`min-h-screen flex justify-center items-center ${themeStyles[themeColor]?.backgroundColor || "bg-purple-600"
          }`}
      >
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl border border-gray-200 mt-5">
          {submittedData ? (
            <div className="space-y-6">
              {submittedData.answers.map((answer, index) => (
                <div key={index} className="border-b border-gray-300 pb-4 mb-4">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    {answer.question}
                  </label>

                  {typeof answer.answer === "string" && (
                    <div className="text-sm text-gray-600 p-2 border rounded-md">
                      {answer.answer}
                    </div>
                  )}

                  {typeof answer.answer === "object" &&
                    Object.keys(answer.answer).map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={answer.answer[option]}
                          readOnly
                          className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                        />
                        <span>{option}</span>
                      </div>
                    ))}

                  {answer.type === "file_upload" && (
                    <div className="text-sm text-gray-600">
                      <a
                        href={submittedData.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 underline"
                        download
                      >
                        View Uploaded File
                      </a>
                    </div>
                  )}


                </div>
              ))}

            </div>
          ) : (
            <p className="text-center text-gray-600">
              No submitted data available.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewResponse;
