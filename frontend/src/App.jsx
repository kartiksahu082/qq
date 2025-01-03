import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [quote, setquote] = useState([]);

  
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get("/quote");
        setquote(response.data); 
        console.log(response.data); 
      } catch (err) {
        console.log(err); 
      }
    };

    fetchdata();
  }, []); 

  return (
    <>
      {quote.length === 0
        ? ""
        : quote.map((e, index) => {
            return (
              <div key={index}>
                <h1>{e.text}</h1>
                <h1>{e.author}</h1>
              </div>
            );
          })}
    </>
  );
}

export default App;
