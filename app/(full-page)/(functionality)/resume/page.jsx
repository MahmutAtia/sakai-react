"use client";
import { useState } from "react";
import { ResumeProvider } from "./ResumeContext";
import EditableResumeTemplate from "./EditableResumeTemplate";

const FileUploadComponent = () => {
  const [responseDate, setResponseDate] = useState({
    "about": "A highly motivated and results-oriented data analyst with a proven track record in diverse fields, including transcription, sales, and interpretation.  My passion lies in leveraging data to extract meaningful insights and drive informed decision-making.  My background in political science and public administration, coupled with my strong analytical skills and proficiency in various programming languages (Python, R, SQL), provides a unique perspective and a robust skillset for tackling complex data challenges.  I'm a fast learner, constantly seeking opportunities to expand my knowledge and stay abreast of the latest advancements in data science.  My experience leading teams, managing projects, and collaborating effectively in diverse environments has honed my leadership and communication skills.  I'm eager to contribute my analytical abilities and collaborative spirit to a dynamic organization where I can continue to learn and grow, making a significant impact through data-driven solutions.  My GitHub profile showcases my ongoing projects and commitment to continuous improvement.  I'm confident in my ability to quickly adapt to new challenges and contribute meaningfully to a team.  Beyond my professional pursuits, I'm actively involved in community initiatives, demonstrating my commitment to social impact and collaborative leadership.  I'm driven by a desire to use my skills to solve real-world problems and contribute to positive change.\n",
    "personal_information": {
        "name": "Mahmoud Atia Ead",
        "email": "mahmoud.atia.ead@gmail.com",
        "phone": [
            "+90 5050782635",
            "+49 1779035921"
        ],
        "location": {
            "address": null,
            "city": null,
            "state": null,
            "postal_code": null
        },
        "profiles": {
            "linkedin": null,
            "github": "https://github.com/MahmutAtia",
            "website": null,
            "portfolio": null
        }
    },
    "summary": "Data analyst with experience in transcription, sales, and interpretation, proficient in Python, R, SQL, and various data visualization tools.  Proven ability to lead teams, manage projects, and communicate effectively.  Seeking a challenging role where I can leverage my analytical skills and contribute to data-driven decision-making.\n",
    "objective": "To secure a challenging data analyst position where I can leverage my analytical and technical skills to contribute to a dynamic team and drive impactful results.  I am eager to apply my expertise in data analysis, statistical modeling, and data visualization to solve complex problems and contribute to organizational success.\n",
    "experience": [
        {   "id": "1",
            "company": "Transcription Project",
            "title": "Transcriptionist",
            "location": "Online",
            "start_date": "12/2021",
            "end_date": "Present",
            "description": "- Listened to recordings and transcribed them accurately into text.\n- Ensured accuracy, reviewed grammar, punctuation, and spelling before submission.\n- Completed transcriptions timely and corrected errors promptly.\n",
            "technologies": []
        },
        {
           "id": "2",
            "company": "Pepperminds Deutschland GmbH",
            "title": "Door-to-door Sales Representative / Team Leader",
            "location": "Stuttgart, Germany",
            "start_date": "02/2021",
            "end_date": "10/2021",
            "description": "- Sold subscriptions for Greenpeace and SOS Kinderdorf through door-to-door sales.\n- Provided comprehensive details on organizations and established a positive image.\n- Convinced clients to subscribe, highlighting service advantages over competitors.\n- Developed understanding of client preferences and followed up on potential subscribers.\n- Answered team questions, resolved problems, and oversaw quality and guideline compliance.\n- Re-engaged and upgraded current or former customers.\n- Managed territories (up to 50 houses/locations daily).\n- Communicated deadlines and goals, providing team encouragement and training.\n",
            "technologies": []
        },
        {
            "id": "3",
            "company": "Freelance",
            "title": "Arabic/Turkish Interpreter",
            "location": null,
            "start_date": "2018",
            "end_date": "Present",
            "description": "- Interpreted between Turkish and Arabic based on client needs.\n- Assisted newly arrived students in Turkey with university and immigration registration.\n",
            "technologies": []
        }
    ],
    "education": [
        {
            "institution": "Ankara University",
            "degree": "Bachelor of Political Science and Public Administration",
            "major": "Political Science and Public Administration",
            "minor": null,
            "gpa": null,
            "graduation_date": "Present",
            "relevant_courses": []
        },
        {
            "institution": "Stuttgart Universität",
            "degree": "Political Science and Social Research",
            "major": "Political Science and Social Research",
            "minor": null,
            "gpa": null,
            "graduation_date": "09/2021",
            "relevant_courses": []
        },
        {
            "institution": "MÜSİAD Independent Industrialists and Businessmen Association",
            "degree": "Foreign Trade Education",
            "major": "Foreign Trade",
            "minor": null,
            "gpa": null,
            "graduation_date": "02/2019",
            "relevant_courses": []
        }
    ],
    "skills": [
        {
            "id": "1",
            "name": "Data Analysis",
            "keywords": [
                "IBM SPSS Statistics",
                "R",
                "Microsoft Access",
                "Python (Pandas)",
                "Microsoft Excel",
                "SQL (MySQL)"
            ]
        },
        {
            "id": "2",
            "name": "Statistical Modeling & Machine Learning",
            "keywords": [
                "Python (NumPy, Scikit-Learn, StatsModels)",
                "R",
                "TensorFlow 2 (Beginner)"
            ]
        },
        {
            "id": "3",
            "name": "Data Visualization",
            "keywords": [
                "R (ggplot2)",
                "Tableau",
                "Python (Matplotlib, Seaborn)"
            ]
        },
        {
            "id": "4",
            "name": "Language & Text Processing",
            "keywords": [
                "Natural Language Processing (R - Quanteda, Python - spaCy)",
                "Regular Expressions (Python)"
            ]
        },
        {
            "id": "5",
            "name": "Other Skills",
            "keywords": [
                "Git Bash & GitHub",
                "Web Scraping & Automation (Python - Selenium, BeautifulSoup)",
                "Command Line",
                "Social Network Analysis (R)"
            ]
        },
        {
            "id": "6",
            "name": "Sales Skills",
            "keywords": [
                "Verbal Communication",
                "Initiative",
                "Active Listening",
                "Communication & Motivation",
                "Flexibility & Adaptability",
                "Interpersonal Skills",
                "Negotiation",
                "Persuasion",
                "Growth Mindset"
            ]
        },
        {
            "id": "7",
            "name": "Management Skills",
            "keywords": [
                "Entrepreneurialism",
                "Multi-tasking",
                "Public Speaking",
                "Public Relations",
                "Leadership",
                "Planning",
                "Collaboration"
            ]
        }
    ],
    "projects": [
        {
            "id": "1",
            "title": "Sentiment Analysis of Twitter Data",
            "description": "Analyzed Twitter data using Python and R to identify sentiment trends and patterns.  Conducted data cleaning, preprocessing, and visualization to extract insights and inform decision-making.",
            "technologies": [
                "Python",
                "R",
                "Natural Language Processing",
                "Data Visualization"
            ]
        },
    ],
    "awards_and_recognition": [],
    "certifications": [],
    "languages": [
        {
            "language": "Arabic",
            "proficiency": "Mother Tongue"
        },
        {
            "language": "English",
            "proficiency": "Listening: C1, Reading: B2, Writing: B1, Speaking: B2"
        },
        {
            "language": "Turkish",
            "proficiency": "Listening: C1, Reading: C1, Writing: C1, Speaking: C1"
        },
        {
            "language": "German",
            "proficiency": "Listening: C1, Reading: C1, Writing: B2, Speaking: C1"
        },
        {
            "language": "Spanish",
            "proficiency": "Listening: A2, Reading: A1, Writing: A1, Speaking: A1"
        }
    ],
    "interests": []
});
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    // Check if file type is supported
    const supportedTypes = [
      "text/plain",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!supportedTypes.includes(file.type)) {
      alert("File type not supported. Please upload txt, doc, or pdf files.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      setFileContent(e.target.result);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!fileContent) {
      alert("Please upload a file first");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/api/resumes/generate/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input: { input_text: fileContent } }),
        },
      );

      if (!response.ok) {
        throw new Error("Upload failed");
        setResponseDate(null);
      }
      const data = await response.json();
      const resume = data.data;
      setResponseDate(resume);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to upload file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".txt,.doc,.docx,.pdf"
          className="block w-full text-sm text-white-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {fileContent && (
        <div className="mb-4">
          <h3 className="font-bold mb-2">File Content:</h3>
          <div className="border p-4 rounded-md bg-gray-50 max-h-60 overflow-auto">
            <pre>{fileContent}</pre>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading || !fileContent}
        className={`px-4 py-2 rounded-md ${
          isLoading || !fileContent
            ? "bg-gray-300"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {isLoading ? "Uploading..." : "Send to API"}
      </button>

      {responseDate && (
        <ResumeProvider initialData={responseDate}>
          <EditableResumeTemplate />
        </ResumeProvider>
      )}
    </div>
  );
};

export default FileUploadComponent;
