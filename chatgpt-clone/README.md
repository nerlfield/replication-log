# ChatGPT Clone

A modern ChatGPT clone built with React, TypeScript, and RadixUI. This application provides a chat interface similar to ChatGPT with mock AI responses.

## Features

- 🎨 **Modern UI**: Clean, responsive design with dark/light theme support
- 💬 **Real-time Chat**: Interactive chat interface with message history
- 🤖 **Mock AI Responses**: Simulated AI responses with realistic delays
- ⚡ **Fast Performance**: Built with Vite for optimal development and build performance
- 🎯 **TypeScript**: Full type safety throughout the application
- 🧩 **RadixUI Components**: Accessible, customizable UI components
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **RadixUI** - Accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Lucide React** - Beautiful icons

## Project Structure

```
src/
├── components/
│   ├── ChatContainer.tsx    # Main chat container component
│   ├── ChatMessage.tsx      # Individual message component
│   ├── ChatInput.tsx        # Message input component
│   ├── ChatHeader.tsx       # Chat header with controls
│   └── index.ts            # Component exports
├── services/
│   └── mockApi.ts          # Mock API service for responses
├── App.tsx                 # Main application component
├── main.tsx               # Application entry point
└── index.css              # Global styles with Tailwind
```

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chatgpt-clone
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Start a Conversation**: Type your message in the input field and press Enter
2. **Send Messages**: Click the send button or press Enter to send messages
3. **Stop Generation**: Click the stop button to interrupt AI response generation
4. **New Chat**: Click the "+" button to start a new conversation
5. **Clear Chat**: Use the menu to clear the current conversation

## Features in Detail

### Chat Interface
- **Message History**: All messages are stored and displayed in conversation order
- **User/AI Distinction**: Clear visual distinction between user and AI messages
- **Timestamps**: Each message includes a timestamp
- **Loading States**: Visual feedback during AI response generation

### Mock API
- **Realistic Responses**: Context-aware responses based on message content
- **Response Delays**: Simulated network delays for realistic experience
- **Error Handling**: Graceful error handling for failed requests
- **Cancellation**: Ability to stop response generation

### UI Components
- **Responsive Layout**: Adapts to different screen sizes
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new lines
- **Auto-scroll**: Automatically scrolls to new messages
- **Loading Animations**: Smooth loading indicators and transitions

## Customization

### Adding New Response Types
Edit `src/services/mockApi.ts` to add new response patterns:

```typescript
const customResponses = [
  "Your custom response here...",
  // Add more responses
];
```

### Styling
The application uses Tailwind CSS for styling. You can customize the theme in `tailwind.config.js` or modify component styles directly.

### Components
All components are modular and can be easily customized or extended. Check the `src/components/` directory for individual component files.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- OpenAI for the inspiration
- RadixUI for the excellent component library
- Tailwind CSS for the utility-first approach
- The React team for the amazing framework
