import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faCopy } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [forms, setForms] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const baseUrl = "http://localhost:3000";
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/quiz/viewdata`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setForms(response.data.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Text copied to clipboard!");
    }).catch((err) => {
      toast.error("Failed to copy text: " + err);
    });
  };

  const deleteUser = async (id) => {
    try {
     const response =  await axios.delete(`${baseUrl}/api/quiz/deleteForm/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setForms((prevForms) => prevForms.filter((form) => form._id !== id));
    if(response.data.success){
      toast.success(response.data.message); 
    }
  
    } catch (error) {
      toast.error('Failed to delete form. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header>
        <div className="flex justify-between p-4 bg-white text-black box-border shadow-md">
          <div className="flex-1 items-center space-x-4" onClick={() => navigate('/home')}>
            <div className="flex items-center space-x-2">
              <img
                src="https://www.gstatic.com/images/branding/product/1x/forms_2020q4_48dp.png"
                alt="Forms Icon"
                className="h-8"
              />
              <h1 className="text-2xl font-bold">Forms</h1>
            </div>
          </div>
          {!token ? (
            <div className="space-x-4">
              <button className="px-4 py-2 bg-[#7248B9] rounded text-white" onClick={() => navigate('/')}>
                Login
              </button>
              <button className="px-4 py-2 bg-[#7248B9] rounded text-white" onClick={() => navigate('/signup')}>
                Signup
              </button>
            </div>
          ) : (
            <div className="flex items-center mx-4 space-x-2 ">
              <img src="https://i.pinimg.com/736x/3d/ad/05/3dad0558b2d7e98a284e952439dc2ca1.jpg" alt="" className="h-12 w-12" />
              <p>{name}</p>
              <p>|</p>
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('name');
                toast.success("Logout Successfully")
                setTimeout(() => {
                  navigate('/')
                }, 1000);
              }}>
                <FontAwesomeIcon icon={faSignOutAlt} className="text-blue-700" />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {!isOnline && (
        <div style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '20px',
          backgroundColor: '#ffcccc',
          borderRadius: '8px',
          zIndex: '9999'
        }}>
          <p>You are currently offline. Please check your internet connection.</p>
        </div>
      )}

      <main className="p-8 bg-gray-200 min-h-screen">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Start a new form</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
              <div className="h-16 w-16 text-2xl mb-6 flex items-center justify-center" onClick={() => navigate('/googleform')}>
                <p className="text-transparent cursor-pointer h-12 bg-clip-text bg-gradient-to-r from-[#ff2e2e] to-[#FF9900] via-[#00ff00] via-[#007bf7] via-[rgb(129,2,255)] via-[#7476f7] text-[55px]">
                  +
                </p>
              </div>
              <p className="text-center text-gray-800">Blank Form</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Recent Forms</h2>
          <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg border-r-8">
            <table className="w-full table-auto mx-auto">
              <thead className="P-4 M-4">
                <tr>
                  <th className="border-b py-4 ">SR No</th>
                  <th className="border-b py-4 ">Form Name</th>
                  <th className="border-b py-4 ">Theme</th>
                  <th className="border-b py-4 ">Questions</th>
                  <th className="border-b py-4 ">Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {forms.length > 0 ? (
                  forms.map((formData, index) => (
                    <tr
                      className="hover:bg-purple-200 hover:text-black"
                      key={formData._id}
                    >
                      <td className="border-b py-4">{index + 1}</td>
                      <td className="border-b py-4">{formData.Form.quizTitle}</td>
                      <td className="border-b py-4">{formData.Form.themeColor}</td>
                      <td className="border-b py-4">
                        {formData.Form.questions ? formData.Form.questions.length : 0}
                      </td>
                      <td className="border-b py-4 flex space-x-2 justify-center">
                        <button className="px-4 py-2 bg-[#60665d] hover:bg-[#593495] rounded text-white" onClick={() => copyToClipboard(`http://localhost:5173/viewform/${formData._id}`)} >
                          <FontAwesomeIcon
                            icon={faCopy}
                            className="text-white cursor-pointer"

                          />
                        </button>

                        <button
                          className="px-4 py-2 bg-[#7248B9] hover:bg-[#593495] rounded text-white"
                          onClick={() => navigate(`/viewform/${formData._id}`)}
                        >
                          View
                        </button>
                        <button
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white"
                          onClick={() => deleteUser(formData._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6">No forms available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <ToastContainer />
    </div>
  );
};

export default Home;
