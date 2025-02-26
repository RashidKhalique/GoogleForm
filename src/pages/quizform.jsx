import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaPlus, FaRegClone, FaPalette, FaEye, FaArrowRight, FaCog, FaCheckCircle, FaTimesCircle, FaUpload, FaCalendarAlt, FaClock } from "react-icons/fa";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
const QuizForm = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "Untitled Question",
      options: [],
      type: "short_answer",
      required: false,
    },
  ]);
  const [quizTitle, setQuizTitle] = useState("Untitled Form");
  const [quizDescription, setQuizDescription] = useState("Form description");
  const [activeTab, setActiveTab] = useState("questions");
  const [themeColor, setThemeColor] = useState("purple");
  const [answers, setAnswers] = useState({});
  const [isToggled, setIsToggled] = useState(false);
  const [newOption, setNewOption] = useState('');
  const [submitdata, setSubmitdata] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const baseUrl = "http://localhost:3000";
  const navigate = useNavigate()
  const token = localStorage.getItem('token');





  const addOption = (questionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => {
        if (q.id === questionId) {
          const newOption = `Option ${q.options.length + 1}`;
          if (!q.options.includes(newOption)) {
            return { ...q, options: [...q.options, newOption] };
          }
        }
        return q;
      })
    );
  };



  const deleteOption = (questionId, optionIndex) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? {
            ...q,
            options: q.options.filter((_, index) => index !== optionIndex),
          }
          : q
      )
    );
  };

  const handleQuestionChange = (questionId, newQuestion) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId ? { ...q, question: newQuestion } : q
      )
    );
  };



  const handleOptionChangedropdown = (questionId, newOptionValue) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? {
            ...q,
            selectedOption: newOptionValue
          }
          : q
      )
    );
  };

  const handleAddOption = (questionId) => {
    if (newOption.trim() && !questions.find(q => q.id === questionId).options.includes(newOption)) {
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === questionId
            ? { ...q, options: [...q.options, newOption] }
            : q
        )
      );
      setNewOption('');
    }
  };



  const [dropdownVisible, setDropdownVisible] = useState(false);


  const toggleDropdown = () => {
    setDropdownVisible(prevState => !prevState);
  };


  const handleOptionChange = (questionId, optionIndex, newOptionValue) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? {
            ...q,
            options: q.options.map((option, index) =>
              index === optionIndex ? newOptionValue : option
            ),
          }
          : q
      )
    );
  };

  // const handleOptionSelectChange = (questionId, selectedOption) => {
  //   setAnswers((prevAnswers) => ({
  //     ...prevAnswers,
  //     [questionId]: selectedOption,
  //   }));
  // };



  const handleAddOptiondropdown = (questionId) => {
    if (newOption.trim() && !questions.find(q => q.id === questionId).options.includes(newOption)) {
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === questionId
            ? { ...q, options: [...q.options, newOption] }
            : q
        )
      );
      setNewOption('');
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      question: "Untitled Question",
      options: [],
      type: "short_answer",
      required: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleTypeChange = (questionId, newType) => {

    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId ? { ...q, type: newType } : q
      )
    );
  };

  const toggleRequired = (questionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId ? { ...q, required: !q.required } : q
      )
    );
  };

  const deleteQuestion = (questionId) => {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== questionId));
  };

  const duplicateQuestion = (questionId) => {
    const questionToDuplicate = questions.find((q) => q.id === questionId);
    const newQuestion = { ...questionToDuplicate, id: questions.length + 1 };
    setQuestions([...questions, newQuestion]);
  };

  const themeStyles = {
    purple: {
      borderColor: "purple-100",
      backgroundColor: "bg-purple-600",
      textColor: "text-purple-600",
      hoverColor: "hover:text-purple-700"
    },
    blue: {
      borderColor: "blue-100",
      backgroundColor: "bg-blue-600",
      textColor: "text-blue-600",
      hoverColor: "hover:text-blue-700"
    },
    red: {
      borderColor: "red-100",
      backgroundColor: "bg-red-600",
      textColor: "text-red-600",
      hoverColor: "hover:text-red-700"
    },
    yellow: {
      borderColor: "yellow",
      backgroundColor: "bg-yellow-600",
      textColor: "text-yellow-600",
      hoverColor: "hover:text-yellow-700"
    }
  };
  const handleToggle = () => {
    if (isToggled) {
      setIsToggled(false);
    } else {
      setIsToggled(true);
    }
  }


  const collectData = () => {
    return {
      quizTitle,
      quizDescription,
      themeColor,
      toggle: isToggled,
      questions: questions.map((q) => ({
        id: q.id,
        question: q.question,
        type: q.type,
        required: q.required,
        options: q.options,
        selectedOption: answers[q.id] || null,
       
      }))
    };
  };





  const resetForm = () => {
    setQuizTitle("");
    setQuizDescription("");
    setQuestions([
      {
        id: 1,
        question: "Untitled Question",
        options: [],
        type: "short_answer",
        required: false,
      },
    ]);
    setThemeColor("purple");
    setAnswers({});
    setNewOption('');
  };

  const handlePublish = async () => {
    const quizData = collectData();



    try {
      const response = await axios.post(`${baseUrl}/api/quiz/createForm`, quizData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });


      if (response.data.success) {
        toast.success(response.data.message)
        setTimeout(() => {
          navigate("/home")
        }, 1000);

        resetForm();
      }
    } catch (error) {
      console.error('Error:', error);
      // toast.error('An error occurred. Please try again later.')
    }
  };

  const handleThemeChange = (e) => {
    setThemeColor(e.target.value);
    setDropdownVisible(false);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/quiz/submitviewall`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSubmitdata(response.data.submitform);
        setUserNames(response.data.userNames);
      } catch (error) {
        console.error('An error occurred. Please try again later.');
      }
    };

    fetchData();
  }, []);



  const deleteUser = async (id) => {
    try {
     const response =  await axios.delete(`${baseUrl}/api/quiz/deleteresponse/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
       setSubmitdata((prevsubmitdata) => prevsubmitdata.filter((submitdata) => submitdata._id !== id));
    if(response.data.success){
      toast.success(response.data.message); 
    }
  
    } catch (error) {
      toast.error('Failed to delete form. Please try again.');
      console.error(error);
    }
  };


  return (
    <>
      <header className={`bg-white border-b px-4 py-4 w-full max-w-10xl mx-auto ${themeStyles[themeColor].textColor}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/home')}>
            <div className={`w-10 h-10 ${themeStyles[themeColor].backgroundColor} rounded cursor-pointer`}></div>
            <div className="flex flex-col">
              <input
                type="text"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                className={`text-lg font-medium cursor-pointer focus:outline-none ${themeStyles[themeColor].textColor}`}
                placeholder="Untitled form"
              />
              <div className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <span>All changes saved in Drive</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <div className="flex items-center gap-2">


              <div className="relative inline-block">

                <button
                  onClick={toggleDropdown}
                  className={`p-2 hover:bg-gray-100 rounded-full ${themeStyles[themeColor].textColor}`}
                >
                  <FaPalette className={`w-5 h-5 text-${themeStyles[themeColor].textColor} `} />
                </button>

                {dropdownVisible && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-300">
                    <select
                      id="theme-color"
                      value={themeColor}

                      onChange={handleThemeChange}
                      className={` block w-full py-2 px-3 border-${themeColor}-500 rounded-md focus:outline-none focus:ring-2`}
                    >
                      <option value="purple">Purple</option>
                      <option value="blue" >Blue</option>
                      <option value="red" >Red</option>
                      <option value="yellow" >Yellow</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            <button className={`bg-${themeColor}-600 text-white px-6 py-2 rounded-md font-medium`}>
              Publish
            </button>

          </div>
        </div>
      </header>

      <div className="border-b bg-white mt-8 w-full max-w-5xl mx-auto">
        <div className="flex justify-center">
          <button
            className={`px-6 py-3 ${activeTab === 'questions' ? `${themeStyles[themeColor].textColor} border-b-2 border-${themeColor}-600` : 'text-gray-600'}`}
            onClick={() => setActiveTab('questions')}
          >
            Questions
          </button>
          <button
            className={`px-6 py-3 ${activeTab === 'responses' ? `${themeStyles[themeColor].textColor} border-b-2 border-${themeColor}-600` : 'text-gray-600'}`}
            onClick={() => setActiveTab('responses')}
          >
            Responses  <span className="p-1 h-1 w-2 rounded-b-full border-b bg-black text-white "> {submitdata.length}</span>
          </button>

        </div>
      </div>
      {activeTab === "questions" ? (

        <div className={`bg-${themeColor}-100 min-h-screen flex justify-center items-center py-8`}>

          <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-end items-left mb-6 ">
              <h2 className="text-xl font-semibold text-gray-800 ">Single Attempt : &nbsp;
                <button
                  onClick={handleToggle}
                  className="bg-purple-500 text-white px-2 py-1 rounded-lg hover:bg-purple-600 transition"
                >
                  {isToggled ? '✔' : '❌'}
                </button>
              </h2>


            </div>

            <div className="mb-6 p-4">
              <input
                required
                type="text"
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Untitled Form"
                className={`text-2xl font-bold w-full border-b-2 border-gray-300 focus:outline-none focus:border-${themeColor}-500 pb-2 mb-2`}
              />
              <input
                type="text"
                required
                onChange={(e) => setQuizDescription(e.target.value)}
                placeholder="Form Description"
                className={`text-xl font-semibold w-full border-b-2 border-gray-300 focus:outline-none focus:border-${themeColor}-500 pb-2 mb-2`}
              />
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Questions</h2>
            </div>

            {questions.map((q) => (
              <div key={q.id} className={`mb-6 p-4 border-2 border-${themeColor}-300 rounded-lg shadow-sm`}>
                <div className="flex justify-between mb-4">
                  <div className="w-full p-3">
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                      placeholder="Untitled Question"
                      className={`text-lg font-medium w-full border-b-2 border-${themeColor}-300 focus:outline-none focus:ring-2 focus:ring-${themeColor}-500 pb-2`}
                    />
                  </div>
                  <select
                    value={q.type}
                    onChange={(e) => handleTypeChange(q.id, e.target.value)}
                    className={`py-2 px-2 text-center border border-${themeColor}-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${themeColor}-500`}
                  >
                    <option value="short_answer">Short Answer</option>
                    <option value="paragraph">Paragraph</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="date">Date</option>
                    <option value="time">Time</option>
                    <option value="file_upload">File Upload</option>
                  </select>
                </div>

                {["multiple_choice", "checkbox"].includes(q.type) && (
                  <div className="space-y-2">
                    {q.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        {q.type === "multiple_choice" ? (
                          <input
                            type="radio"
                            value={option}
                            onChange={(e) => handleOptionChange(q.id, e.target.value)}
                            name={`question-${q.id}`}
                            className={`w-5 h-5 text-${themeColor}-600`}
                          />
                        ) : (
                          <input
                            type="checkbox"
                            value={option}
                            onChange={(e) => handleOptionChange(q.id, e.target.value)}
                            name={`question-${q.id}`}
                            className={`w-5 h-5 text-${themeColor}-600`}
                          />
                        )}
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(q.id, index, e.target.value)}
                          placeholder="Option"
                          className={`w-full border-b-2 border-${themeColor}-300 focus:outline-none focus:ring-2 focus:ring-${themeColor}-500`}
                        />
                        <button
                          className={`text-${themeColor}-500 hover:text-${themeColor}-700 transition`}
                          onClick={() => deleteOption(q.id, index)}
                          aria-label="Delete option"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {["date", "time", "file_upload"].includes(q.type) && (
                  <div className={`p-4 text-sm text-${themeColor}-600`}>
                    {q.type === "date" && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="date"
                          disabled
                          className="p-4 border border-gray-300 rounded-md w-30"
                        />
                        <FaCalendarAlt size={24} />
                      </div>
                    )}
                    {q.type === "time" && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="time"
                          disabled
                          className="w-30 py-2 border border-gray-300 rounded-md"
                        />
                        <FaClock size={24} />
                      </div>
                    )}
                    {q.type === "file_upload" && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          disabled
                          className="w-30 p-4 border border-gray-300 rounded-md"
                        />
                        <FaUpload />
                      </div>
                    )}
                  </div>
                )}

                {(q.type === "multiple_choice" || q.type === "checkbox") && (
                  <button
                    className={`mt-4 text-${themeColor}-600 hover:underline flex items-center space-x-2`}
                    onClick={() => addOption(q.id)}
                  >
                    <FaPlus />
                    <span>Add option</span>
                  </button>
                )}

                {q.type === "dropdown" && (
                  <div className="space-y-2">
                    <select
                      name={`question-${q.id}`}
                      value={q.selectedOption ? '' : ""}
                      className={`w-full p-2 border-b-2 border-${themeColor}-300 focus:outline-none focus:ring-2 focus:ring-${themeColor}-500`}
                      onChange={(e) => handleOptionChangedropdown(q.id, e.target.value)}
                    >
                      {q.options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="text"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        placeholder="Add a new option"
                        className="p-2 border-2 border-gray-300 rounded"
                      />
                      <button
                        onClick={() => handleAddOption(q.id)}
                        className="p-2 bg-blue-500 text-white rounded"
                      >
                        Add Option
                      </button>
                    </div>
                  </div>
                )}

                {q.type === "paragraph" && (
                  <textarea
                    name={`question-${q.id}`}
                    className={`w-full p-4 border-2 border-${themeColor}-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${themeColor}-500`}
                    rows="4"
                    disabled
                    placeholder="Your paragraph answer here"
                    onChange={(e) => handleParagraphChange(q.id, e.target.value)}
                  />
                )}

                {q.type === "short_answer" && (
                  <input
                    type="text"
                    name={`question-${q.id}`}
                    className={`w-full p-2 border-2 border-${themeColor}-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${themeColor}-500`}
                    placeholder="Your short answer here"
                    disabled
                    onChange={(e) => handleShortAnswerChange(q.id, e.target.value)}
                  />
                )}

                <div className="flex items-center space-x-3 mt-4">
                  <input
                    type="checkbox"
                    checked={q.required}
                    onChange={() => toggleRequired(q.id)}
                    className={`w-6 h-6 text-${themeColor}-600`}
                  />
                  <span className="text-sm">Required</span>
                </div>

                <div className="flex justify-end space-x-5 mt-4">
                  <button
                    className={`text-${themeColor}-500 text-xl hover:text-${themeColor}-700 transition`}
                    onClick={() => duplicateQuestion(q.id)}
                    aria-label="Duplicate question"
                  >
                    <FaRegClone size={20} />
                  </button>
                  <button
                    className={`text-${themeColor}-500 text-xl hover:text-${themeColor}-700 transition`}
                    onClick={() => deleteQuestion(q.id)}
                    aria-label="Delete question"
                  >
                    <FaTrashAlt size={20} />
                  </button>
                  <button
                    className={`text-${themeColor}-600 hover:underline flex items-center space-x-3`}
                    onClick={addQuestion}
                    aria-label="Add new question"
                  >
                    <FaPlus size={24} />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end space-x-3 mt-6">
              <button className={`px-6 py-2 bg-${themeColor}-200 text-gray-700 rounded-lg`}>
                Cancel
              </button>
              <button
                className={`px-6 py-2 bg-${themeColor}-600 text-white rounded-lg hover:bg-${themeColor}-700 transition`}
                onClick={handlePublish}
              >
                Publish
              </button>
            </div>
          </div>





        </div>
      ) : (
        <div className={`bg-${themeColor}-100  flex justify-center  items-center `} id="response">
          <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 text-center">Responses</h2>
            </div>



            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="border-b py-2 ">User Name</th>
                  <th className="border-b py-2 ">Quiz Name</th>
                  <th className="border-b py-2 ">Submitted At</th>
                  <th className="border-b py-2 ">Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {submitdata.length > 0 ? (
                  submitdata.map((formData, index) => (
                    <tr className={`hover:bg-${themeColor}-400 hover:text-${themeColor}-200`} key={formData._id}>
                      <td className="border-b py-1">{userNames[index]}</td>
                      <td className="border-b py-2">{formData.QuizName}</td>
                      <td className="border-b py-2">{new Date(formData.submittedAt).toLocaleString()}</td>

                      <td className="border-b py-2 flex space-x-2 justify-center">
                        <button
                          className={`px-4 py-2 ${themeStyles[themeColor].backgroundColor}  text-white rounded `}
                          onClick={() => navigate(`/submitedform/${formData._id}`)}
                        >
                          View
                        </button>
                        <button
                          className={`px-4 py-2 bg-red-500 text-white rounded `}
                          onClick={() => deleteUser(formData._id)}
                        >
                          Delete
                        </button>
                        
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">No forms available.</td>
                  </tr>
                )}
              </tbody>
            </table>




          </div>
        </div>
      )}



    </>
  );
};

export default QuizForm;
