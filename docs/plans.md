# Nalar Project: 10-Day Implementation Plan

## Project Overview
A personalized AI study buddy with interactive chat, quiz functionality, and knowledge tracking, designed to help users learn and understand subjects through conversation and assessment.

## Core Features

### 1. Interactive AI Chat
- Math-enabled chat interface (using CortexJS for math input)
- AI agent that can:
  - Ask users about their knowledge
  - Allow users to explain concepts in their own words
  - Provide alternative explanations
  - Suggest learning paths
  - Generate quizzes based on conversation
  
### 2. Quiz System
- Multiple choice and True/False questions
- Immediate feedback after answering each question
- Question generation based on topics discussed in chat
- Quiz history tracking

### 3. Knowledge Graph (Simplified)
- Topic representation with understanding level
- Connections between related topics
- Visual representation of user's knowledge landscape
- AI-generated updates based on chat interactions and quiz results

### 4. Onboarding Flow
- Learning goals collection
- Current knowledge level assessment
- Study reason identification
- User study plan preferences
- Simple learning plan generation

### 5. Aside Panel
- Quiz history with scores and dates
- Basic progress indicators

## Database Schema Extensions

```typescript
// For quizzes
quizzes: defineTable({
  userId: v.id("users"),
  title: v.string(),
  topic: v.string(),
  createdAt: v.number(),
  questions: v.array(v.object({
    questionText: v.string(),
    options: v.array(v.string()),
    correctOptionIndex: v.number(),
    explanation: v.string(),
    type: v.union(v.literal("multiple_choice"), v.literal("true_false")),
  })),
}).index("by_userId", ["userId"]),

// For quiz attempts
quiz_attempts: defineTable({
  userId: v.id("users"),
  quizId: v.id("quizzes"),
  startedAt: v.number(),
  completedAt: v.optional(v.number()),
  score: v.optional(v.number()),
  answers: v.array(v.object({
    questionIndex: v.number(),
    selectedOptionIndex: v.number(),
    isCorrect: v.boolean(),
  })),
}).index("by_userId", ["userId"]),
```

## Day-by-Day Implementation Plan

### Day 0: Basic Page Templates
- [X] Create basic page templates
  - [X] Dashboard/Home page layout
  - [X] Chat interface template
  <!-- - [ ] Quiz interface template -->
  <!-- - [ ] Settings page structure -->

### Days 1-2: AI Agent Instructions & Math Input
- [X] Integrate CortexJS MathField library
  - [X] Install required packages
  - [X] Create wrapper component for math input
  - [X] Style the math input field
- [X] Update chat interface to support math expressions
  - [X] Modify message component to render math formulas
  - [X] Add toggle between text and math input modes
- [X] Define instructions for "Nalar," the AI learning partner.
  - **Role:** An interactive AI math tutor named Nalar.
  - **Persona:** Encouraging, patient, and adaptive.
  - **Core Flow:**
    1.  **User Question → AI Analysis:** Understand the user's query.
    2.  **Knowledge Probing:** Ask targeted questions to assess the user's current understanding of the topic.
    3.  **Explanation:** Provide clear, simple explanations with concrete examples. Break down complex topics.
    4.  **Explanation Verification:** After 2-3 explanations, ask the user to explain the concept in their own words (e.g., "Can you explain that back to me in your own words?").
    5.  **Understanding Assessment:** Based on the user's response, assess their understanding.
    6.  **Alternative Explanations:** If the user is struggling, provide the concept from a different perspective.
    7.  **Practice & Quizzing:**
        - After a few cycles of explanation and verification, suggest a short practice problem.
        - If the user performs well, suggest a formal quiz using the `createQuiz` tool.
    8.  **Knowledge Graph Update:** Throughout the conversation, use the `updateKnowledgeGraph` tool to track the user's progress on different concepts.
    9.  **Contextual Suggestions:** Recommend related topics or "learn more" resources based on the conversation.
- [X] Implement response format handling for math expressions
  - [X] Parse LaTeX from AI responses
  - [X] Render expressions properly in chat

### Days 3-4: Quiz System
- [X] Extend database schema for quizzes
  - [X] Add quiz tables to schema
  - [X] Create model types for quiz data
- [X] Implement quiz generation function in AI agent
  - [X] Create function to generate quiz questions
  - [X] Add quiz topic extraction from conversation
  - [X] Implement difficulty adjustment based on user level
- [X] Build quiz UI components
  - [X] Quiz start interface
  - [X] Question display component
  - [X] Option selection interface
  - [X] Results and feedback display
- [X] Develop quiz flow
  - [X] Question navigation
  - [X] Answer submission
  - [X] Immediate feedback mechanism
  - [X] Final score calculation and display
- [X] Implement quiz history storage
  - [X] Save completed quizzes
  - [X] Store user responses and scores

### Days 5-6: Knowledge Graph & Visualization
- [X] Enhance knowledge node system
  - [X] Implement topic extraction from chat
  - [X] Create function to update understanding level based on quiz results
  - [X] Add relationship mapping between topics
- [X] Build knowledge graph visualization
  - [X] Select and integrate visualization library
  - [X] Create force-directed graph component
  - [X] Add node styling based on understanding level
  - [X] Implement zoom and pan functionality
- [X] Develop graph update mechanism
  - [X] Create AI tool for updating knowledge graph
  - [X] Implement triggers for graph updates (after quiz, key chat moments)
  - [X] Add real-time visualization updates

### Day 7: Onboarding Refinement
- [X] Enhance existing onboarding flow
  - [X] Update user profile schema if needed
  - [X] Refine onboarding UI components
  - [X] Improve form validation
- [X] Add learning plan generation
  - [X] Create AI prompt for learning plan creation
  - [X] Implement plan display component
  - [X] Store plan in user profile
- [X] Create personal dashboard with plan
  - [X] Build dashboard layout
  - [X] Add learning plan display
  - [X] Create quick access to quizzes and chats

### Day 8: Aside Panel & History
- [X] Develop quiz history panel
  - [X] Create history list component
  - [X] Display quiz scores and dates
  - [X] Add quiz details expansion
- [ ] Implement progress indicators
  - [ ] Design progress visualization
  - [ ] Create topic progress component
  - [ ] Build overall progress summary
- [ ] Add history features
  - [ ] Implement filtering and sorting
  - [ ] Add quick quiz retry functionality
  - [ ] Create topic-based history grouping

### Day 9: Integration & Testing
- [ ] Connect all components into cohesive flow
  - [ ] Link chat to quiz generation
  - [ ] Connect quiz results to knowledge graph
  - [ ] Integrate history with dashboard
- [ ] Perform end-to-end testing
  - [ ] Test user journeys
  - [ ] Verify data persistence
  - [ ] Check responsive design
- [ ] Fix bugs and edge cases
  - [ ] Handle error states
  - [ ] Implement fallbacks
  - [ ] Test different input scenarios

### Day 10: Polish & Documentation
- [ ] UI/UX refinements
  - [ ] Improve visual consistency
  - [ ] Add transitions and animations
  - [ ] Enhance accessibility
- [ ] Add loading states
  - [ ] Implement skeleton loaders
  - [ ] Add progress indicators
  - [ ] Create smooth loading transitions
- [ ] Write documentation
  - [ ] Document code and components
  - [ ] Create user guides
  - [ ] Write API documentation
- [ ] Final testing
  - [ ] Test across different devices
  - [ ] Verify performance
  - [ ] Conduct final bug sweep

## Key Technical Components

1. **AI Agent Tools**
   - `createQuiz`: Generates quiz based on topics discussed or specified by user
   - `updateKnowledgeGraph`: Updates knowledge nodes based on chat/quiz interactions

2. **UI Components**
   - Math input field using CortexJS
   - Knowledge graph visualization (simplified force-directed graph)
   - Quiz interface with immediate feedback
   - Chat with support for math expressions

3. **Data Flow**
   - User chat interactions trigger knowledge assessment
   - Knowledge updates reflected in graph visualization
   - Quiz results update understanding levels
   - History panel shows learning progress

## Future Extensions (Post 10 Days)
- Advanced adaptive quiz difficulty
- Comprehensive progress tracking
- Gamification elements (badges, streaks)
- Study planning and scheduling
- Additional quiz types (fill-in-blank, free response)