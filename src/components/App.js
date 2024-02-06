// App.js
import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState("List");

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  const handleNewQuestionSubmit = (formData) => {
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then((response) => response.json())
    .then((data) => {
      setQuestions([...questions, data]);
      setPage("List"); // Redirect to QuestionList after adding a question
    })
    .catch((error) => console.error("Error adding new question:", error));
  };

  const handleQuestionDelete = (id) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE"
    })
    .then(() => {
      const updatedQuestions = questions.filter((question) => question.id !== id);
      setQuestions(updatedQuestions);
    })
    .catch((error) => console.error("Error deleting question:", error));
  };

  const handleCorrectAnswerChange = (id, correctIndex) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ correctIndex })
    })
    .then(() => {
      const updatedQuestions = questions.map((question) => {
        if (question.id === id) {
          return { ...question, correctIndex };
        } else {
          return question;
        }
      });
      setQuestions(updatedQuestions);
    })
    .catch((error) => console.error("Error updating question:", error));
  };

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onSubmit={handleNewQuestionSubmit} />
      ) : (
        <QuestionList
          questions={questions}
          onDelete={handleQuestionDelete}
          onCorrectAnswerChange={handleCorrectAnswerChange}
        />
      )}
    </main>
  );
}

export default App;
