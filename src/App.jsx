import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

// const API_KEY = "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";
// // "Explain things like you would to a 10 year old learning how to code."
// const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
//   "role": "system", "content": "Explain things like you're talking to a software professional with 2 years of experience."
// }

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    console.log('message :>> ', message);

    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    
    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessage);
  };

  async function processMessageToChatGPT(chatMessage) { 
    // messages is an array of messages
    // Format messages for chatGPT API
    

    const messageBody = {
      query: chatMessage.message  
    }

    const agentId = 'd83c8f4f-ca91-4150-bcbe-28f06999ff9e';
    const userUniqueStr = 'computer1';


    await fetch(`http://localhost:8000/ai/assistant/${agentId}?user_unique_str=${userUniqueStr}`, 
    {
      method: "POST",
      body: JSON.stringify(messageBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      // setMessages([...chatMessages, {
      //   message: data.choices[0].message.content,
      //   sender: "ChatGPT"
      // }]);
      setIsTyping(false);
    });
  }

  return (
    <div className="App">
      <div style={{ position:"relative", height: "800px", width: "700px"  }}>
        <MainContainer>
          <ChatContainer>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => {
                console.log(message)
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />        
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App
