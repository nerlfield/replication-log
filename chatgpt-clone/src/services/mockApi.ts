import type { Message } from '../components/ChatMessage';

// Mock responses for different types of questions
const mockResponses = [
  "I'm a helpful AI assistant created by OpenAI. I'm here to help you with questions, writing, analysis, coding, and many other tasks. What would you like to know?",
  
  "That's a great question! Let me think about this...\n\nThere are several ways to approach this problem:\n\n1. **First approach**: We could consider the fundamental principles\n2. **Second approach**: We might look at practical applications\n3. **Third approach**: We could examine real-world examples\n\nWhat specific aspect would you like me to elaborate on?",
  
  "I'd be happy to help you with that! Here's a comprehensive explanation:\n\n**Key Points:**\n- This is an important concept to understand\n- It has practical applications in many fields\n- There are some common misconceptions to avoid\n\n**Examples:**\n- Example 1: A simple case that demonstrates the principle\n- Example 2: A more complex scenario that shows advanced usage\n\nWould you like me to dive deeper into any of these areas?",
  
  "That's an interesting perspective! Let me provide some additional context and analysis:\n\n**Background:**\nThis topic has been discussed extensively in various fields, and there are multiple viewpoints to consider.\n\n**Different Perspectives:**\n- **Perspective A**: Some experts argue that...\n- **Perspective B**: Others believe that...\n- **Perspective C**: A third view suggests...\n\n**Current Trends:**\nRecent developments have shown that the landscape is evolving rapidly.\n\nWhat's your take on this? I'd be interested to hear your thoughts!",
  
  "I understand you're looking for help with this. Here's a step-by-step approach:\n\n**Step 1: Assessment**\nFirst, let's identify the core requirements and constraints.\n\n**Step 2: Planning**\nNext, we'll outline a strategy that addresses your specific needs.\n\n**Step 3: Implementation**\nThen, we'll put the plan into action with clear milestones.\n\n**Step 4: Evaluation**\nFinally, we'll assess the results and make any necessary adjustments.\n\nWould you like me to elaborate on any of these steps?",
];

const codeResponses = [
  "Here's a solution using modern JavaScript/TypeScript:\n\n```typescript\nfunction example(param: string): string {\n  // Implementation here\n  return param.toUpperCase();\n}\n\n// Usage example\nconst result = example('hello world');\nconsole.log(result); // 'HELLO WORLD'\n```\n\nThis approach is efficient and follows best practices. Would you like me to explain any specific part?",
  
  "I can help you with that! Here's a React component example:\n\n```jsx\nimport React, { useState } from 'react';\n\nconst ExampleComponent = () => {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n};\n\nexport default ExampleComponent;\n```\n\nThis demonstrates state management and event handling in React. Need any clarification?",
];

const technicalResponses = [
  "From a technical standpoint, this involves several important considerations:\n\n**Architecture:**\n- Scalability requirements\n- Performance optimization\n- Security considerations\n- Maintainability\n\n**Implementation Details:**\n- Technology stack selection\n- Database design\n- API structure\n- Testing strategy\n\n**Best Practices:**\n- Follow established patterns\n- Ensure proper error handling\n- Implement comprehensive logging\n- Plan for monitoring and debugging\n\nWould you like me to focus on any particular aspect?",
];

function getRandomResponse(message: string): string {
  const lowercaseMessage = message.toLowerCase();
  
  // Check for code-related keywords
  if (lowercaseMessage.includes('code') || 
      lowercaseMessage.includes('function') || 
      lowercaseMessage.includes('javascript') || 
      lowercaseMessage.includes('typescript') || 
      lowercaseMessage.includes('react') || 
      lowercaseMessage.includes('component')) {
    return codeResponses[Math.floor(Math.random() * codeResponses.length)];
  }
  
  // Check for technical keywords
  if (lowercaseMessage.includes('architecture') || 
      lowercaseMessage.includes('database') || 
      lowercaseMessage.includes('api') || 
      lowercaseMessage.includes('system') || 
      lowercaseMessage.includes('technical')) {
    return technicalResponses[Math.floor(Math.random() * technicalResponses.length)];
  }
  
  // Return a general response
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
}

export interface MockApiResponse {
  message: Message;
  delay: number;
}

export class MockApi {
  private static instance: MockApi;
  private abortController: AbortController | null = null;

  static getInstance(): MockApi {
    if (!MockApi.instance) {
      MockApi.instance = new MockApi();
    }
    return MockApi.instance;
  }

  async sendMessage(userMessage: string): Promise<MockApiResponse> {
    // Create a new abort controller for this request
    this.abortController = new AbortController();
    
    const delay = Math.random() * 2000 + 1000; // 1-3 seconds delay
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        if (this.abortController?.signal.aborted) {
          reject(new Error('Request aborted'));
          return;
        }

        const response = getRandomResponse(userMessage);
        const message: Message = {
          id: Date.now().toString(),
          content: response,
          role: 'assistant',
          timestamp: new Date(),
        };

        resolve({ message, delay });
      }, delay);

      // Handle abort signal
      this.abortController?.signal.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new Error('Request aborted'));
      });
    });
  }

  // Simulate streaming response (for future enhancement)
  async *streamMessage(userMessage: string): AsyncGenerator<string, void, unknown> {
    const response = getRandomResponse(userMessage);
    const words = response.split(' ');
    
    for (const word of words) {
      if (this.abortController?.signal.aborted) {
        throw new Error('Request aborted');
      }
      
      yield word + ' ';
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    }
  }

  stopGeneration(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}