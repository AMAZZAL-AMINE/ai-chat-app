import { useState } from "react";
import "./App.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "YOUR_GOOGLE_AI_API_KEY"
const array = new Array([]);

function App() {
  const [isThinking, setIsThinking] = useState(false);
  const genAI = new GoogleGenerativeAI(API_KEY);


  const sendMessageAndGetResponse = async (message) => {
    try {
      let data = {
        message : "",
        from : "",
        date : 0,
      }
      data.message = message;
      data.date = new Date();
      data.from = "user";
      array.push(data)
      setIsThinking(true);
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      const result = await model.generateContent(message);
      const response = await result.response;
      const text = response.text();
      setIsThinking(false);
      data = {
        message : "",
        from : "",
        date : 0,
      }
      console.log("ai respond : ", text);
      data.message = text;
      data.date = new Date();
      data.from = "ai";
      array.push(data)
    } catch (err) {
      let errdata = {
        message : "",
        from : "",
        date : 0,
      }
      errdata.message = "Text not available. Response was blocked due to SAFETY, please clean your month";
      errdata.date = new Date();
      errdata.from = "ai";
      array.push(errdata)
      console.log("ai error : ", err);
      setIsThinking(false)
    }
  };

  return (
    <div className="chat-app">
      {/* <div className="chat-container"> */}
        <div className="chat-header">
          <div className="message-container">
            {
              array.map((item, index) => (
                <div key={index}>
                    {item.from === "user"  && (
                      <div className="mine-message">
                        <div className="message">
                          {item.message}
                        </div>
                      </div>
                    )}
                    {(item.from === "ai") && (
                      <div className="ai-message">
                        <div className="message">
                          {item.message}
                        </div>
                      </div>
                    )
                  }
                </div>
              ))
            }
           {isThinking && <div style={{
            color:"Highlight",
            fontSize:21
           }}>Thinking...</div>}
          </div>
        </div>
        <div className="input-field">
          <input
            type="text"
            placeholder="Type a message..."
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessageAndGetResponse(e.target.value);
                e.target.value = ""
              }
            }}
          />
        </div>
      {/* </div> */}
    </div>
  );
}

export default App;
