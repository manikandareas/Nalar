# Database Implementation Guide - AI Study Buddy (10 Days)

## Schema Overview

The Convex schema, updated with Clerk authentication, defines 18 main tables for the AI Study Buddy, covering all required functionality. The `users` table is tailored to Clerk's authentication, while other tables support the learning platform's features. The design optimizes for rapid development and scalability using Convex's document-based NoSQL structure.

## Implementation Strategy for 10 Days

### Phase 1: Core Tables (Days 1-2)
**Priority: CRITICAL - MVP functionality**

```typescript
// Convex Schema Excerpt (schema.ts)

// 1. users (handled by Clerk Auth)
users: defineTable({
  username: v.string(),
  email: v.string(),
  userId: v.string(), // Clerk userId
  profileImage: v.optional(v.string()),
  alreadyOnboarded: v.boolean(),
}).index("by_user_id", ["userId"]),

// 2. user_profiles
user_profiles: defineTable({
  userId: v.id("users"),
  learningGoals: v.array(v.string()),
  overallLevel: v.number(),
  strengths: v.array(v.string()),
  weaknesses: v.array(v.string()),
  studyStreak: v.number(),
  streakStartDate: v.number(),
  learningPreferences: v.any(),
  updatedAt: v.number(),
}).index("by_userId", ["userId"]),

// 3. subjects
subjects: defineTable({
  name: v.string(),
  description: v.string(),
  iconUrl: v.optional(v.string()),
  difficultyLevel: v.number(),
  isActive: v.boolean(),
}).index("by_name", ["name"]),

// 4. topics
topics: defineTable({
  subjectId: v.id("subjects"),
  parentTopicId: v.optional(v.id("topics")),
  name: v.string(),
  description: v.string(),
  prerequisites: v.array(v.id("topics")),
  estimatedDuration: v.number(),
  difficultyLevel: v.number(),
  learningObjectives: v.array(v.string()),
  isActive: v.boolean(),
}).index("by_subjectId", ["subjectId"]).index("by_parentTopicId", ["parentTopicId"]),
```

### Phase 2: Learning Core (Days 3-4)
**Priority: HIGH - Core learning functionality**

```typescript
// 5. chat_conversations
chat_conversations: defineTable({
  userId: v.id("users"),
  topicId: v.optional(v.id("topics")),
  title: v.string(),
  updatedAt: v.number(),
  isArchived: v.boolean(),
}).index("by_userId", ["userId"]).index("by_topicId", ["topicId"]),

// 6. chat_messages
chat_messages: defineTable({
  conversationId: v.id("chat_conversations"),
  senderType: v.union(v.literal("user"), v.literal("ai")),
  messageContent: v.string(),
  messageMetadata: v.any(),
  aiResponseData: v.any(),
  isHelpful: v.optional(v.boolean()),
}).index("by_conversationId", ["conversationId"]),

// 7. user_topic_progress
user_topic_progress: defineTable({
  userId: v.id("users"),
  topicId: v.id("topics"),
  status: v.union(v.literal("not_started"), v.literal("in_progress"), v.literal("completed"), v.literal("mastered")),
  completionPercentage: v.number(),
  currentLevel: v.number(),
  masteryIndicators: v.any(),
  startedAt: v.number(),
  completedAt: v.optional(v.number()),
  lastAccessed: v.number(),
  totalTimeSpent: v.number(),
}).index("by_userId_topicId", ["userId", "topicId"]),

// 8. learning_sessions
learning_sessions: defineTable({
  userId: v.id("users"),
  topicId: v.id("topics"),
  sessionType: v.union(v.literal("study"), v.literal("practice"), v.literal("assessment"), v.literal("chat")),
  startTime: v.number(),
  endTime: v.number(),
  durationMinutes: v.number(),
  activities: v.array(v.any()),
  aiInteractions: v.any(),
  engagementScore: v.number(),
  outcomes: v.any(),
}).index("by_userId", ["userId"]).index("by_topicId", ["topicId"]),
```

### Phase 3: Assessment & Practice (Days 5-6)
**Priority: MEDIUM - Enhanced functionality**

```typescript
// 9. practice_problems
practice_problems: defineTable({
  topicId: v.id("topics"),
  problemType: v.union(v.literal("multiple_choice"), v.literal("open_ended"), v.literal("step_by_step")),
  problemStatement: v.string(),
  problemData: v.any(),
  correctAnswer: v.any(),
  solutionSteps: v.any(),
  difficultyLevel: v.number(),
  hints: v.array(v.string()),
  metadata: v.any(),
  isActive: v.boolean(),
}).index("by_topicId", ["topicId"]),

// 10. user_practice_attempts
user_practice_attempts: defineTable({
  userId: v.id("users"),
  problemId: v.id("practice_problems"),
  userResponse: v.any(),
  isCorrect: v.boolean(),
  hintsUsed: v.number(),
  timeTakenSeconds: v.number(),
  aiFeedback: v.any(),
  understandingScore: v.number(),
  attemptedAt: v.number(),
}).index("by_userId", ["userId"]).index("by_problemId", ["problemId"]),

// 11. assessments (Simplified for MVP)
assessments: defineTable({
  topicId: v.id("topics"),
  assessmentType: v.union(v.literal("pre_test"), v.literal("quiz"), v.literal("adaptive")),
  title: v.string(),
  description: v.string(),
  questions: v.array(v.any()),
  totalPoints: v.number(),
  timeLimitMinutes: v.number(),
  isActive: v.boolean(),
}).index("by_topicId", ["topicId"]),
```

### Phase 4: Analytics &Gamification (Days 7-8)
**Priority: LOW - Nice to have**

```typescript
// 12. user_analytics (Simplified)
user_analytics: defineTable({
  userId: v.id("users"),
  analyticsDate: v.number(),
  dailyMetrics: v.any(),
  performanceMetrics: v.any(),
  engagementMetrics: v.any(),
  aiUsageMetrics: v.any(),
}).index("by_userId_date", ["userId", "analyticsDate"]),

// 13. achievements (Pre-populated data)
achievements: defineTable({
  name: v.string(),
  description: v.string(),
  iconUrl: v.optional(v.string()),
  criteria: v.any(),
  pointsReward: v.number(),
  category: v.union(v.literal("streak"), v.literal("mastery"), v.literal("participation"), v.literal("improvement")),
  isActive: v.boolean(),
}).index("by_category", ["category"]),

// 14. user_achievements
user_achievements: defineTable({
  userId: v.id("users"),
  achievementId: v.id("achievements"),
  earnedAt: v.number(),
  metadata: v.any(),
}).index("by_userId", ["userId"]).index("by_achievementId", ["achievementId"]),
```

## Simplified Schema for MVP (10 Days)

### Core Tables Only (Minimum Viable Product)
```typescript
// ESSENTIAL TABLES FOR MVP
1. users (Clerk Auth)
2. user_profiles
3. subjects (pre-populated)
4. topics (pre-populated)
5. chat_conversations
6. chat_messages
7. user_topic_progress
8. learning_sessions
9. practice_problems (AI-generated)
10. user_practice_attempts

// OPTIONAL FOR MVP (if time permits)
11. user_analytics (basic version)
12. achievements (pre-populated)
```

## Database Optimization Strategies

### Convex-Specific Optimizations

**1. Document Structure**
```typescript
// Good: Flat structure for efficient queries
user_profiles: { userId, learningGoals, overallLevel, ... }

// Avoid: Deeply nested objects
user_profiles: { learningData: { goals: { mathematics: { ... } } } }
```

**2. Indexes**
```typescript
// Defined in schema.ts for common queries
- users: index("by_user_id", ["userId"])
- user_topic_progress: index("by_userId_topicId", ["userId", "topicId"])
- chat_messages: index("by_conversationId", ["conversationId"])
- learning_sessions: index("by_userId", ["userId"])
- user_practice_attempts: index("by_userId", ["userId"])
```

**3. Data Denormalization**
```typescript
// Store frequently accessed data together
user_profiles: {
  userId: v.id("users"),
  currentTopics: v.array(v.object({
    topicId: v.id("topics"),
    name: v.string(),
    progressPercentage: v.number(),
    lastAccessed: v.number()
  })),
  recentSessions: v.array(v.any())
}
```

## Implementation Timeline

### Day 1: Database Setup
- Convex project initialization
- Clerk authentication integration
- Schema definition (`schema.ts`) with updated `users` table
- Basic access control in query/mutation functions

### Day 2: Core Data Models
- User management system (sync with Clerk)
- Subject/Topic hierarchy
- Basic CRUD operations via Convex mutations/queries

### Day 3-4: Learning Features
- Chat system implementation
- Progress tracking
- Session management

### Day 5-6: Practice System
- Problem generation logic
- Assessment framework
- Answer evaluation

### Day 7-8: Optimization
- Query performance tuning
- Basic analytics setup
- Caching implementation

## Access Control Example

```typescript
// convex/queries.ts
import { query } from "./_generated/server";

export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== (await ctx.db.get(args.userId)).userId) {
      throw new Error("Unauthorized");
    }
    return await ctx.db.query("user_profiles").filter(q => q.eq(q.field("userId"), args.userId)).first();
  },
});

// convex/mutations.ts
import { mutation } from "./_generated/server";

export const createChatConversation = mutation({
  args: { userId: v.id("users"), topicId: v.optional(v.id("topics")), title: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== (await ctx.db.get(args.userId)).userId) {
      throw new Error("Unauthorized");
    }
    return await ctx.db.insert("chat_conversations", {
      userId: args.userId,
      topicId: args.topicId,
      title: args.title,
      updatedAt: Date.now(),
      isArchived: false,
    });
  },
});
```

## Data Migration Strategy

### Pre-populated Data
```typescript
// convex/mutations/seed.ts
import { mutation } from "./_generated/server";

export const seedSubjects = mutation({
  handler: async (ctx) => {
    await ctx.db.insert("subjects", {
      name: "Mathematics",
      description: "Core mathematical concepts",
      difficultyLevel: 3,
      isActive: true,
    });
    // Additional subjects...
  },
});

export const seedTopics = mutation({
  handler: async (ctx) => {
    const mathSubject = await ctx.db.query("subjects").filter(q => q.eq(q.field("name"), "Mathematics")).first();
    if (mathSubject) {
      await ctx.db.insert("topics", {
        subjectId: mathSubject._id,
        name: "Calculus",
        description: "Advanced mathematical concepts",
        prerequisites: [],
        estimatedDuration: 120,
        difficultyLevel: 7,
        learningObjectives: ["Understand derivatives", "Apply integrals"],
        isActive: true,
      });
    }
  },
});
```

## Performance Considerations

### Query Optimization
- Use defined indexes for efficient filtering
- Implement pagination with `db.query().paginate()`
- Cache frequently accessed data client-side
- Use subscriptions for real-time updates sparingly

### Storage Optimization
- Compress large text fields (e.g., `problemStatement`)
- Implement data cleanup for old sessions
- Use `v.any()` judiciously to avoid schema bloat

## Monitoring & Maintenance

### Analytics Tracking
- User engagement metrics via `user_analytics`
- AI API usage monitoring
- Query performance tracking
- Error rate monitoring via Convex dashboard

Dengan schema Convex yang diperbarui, integrasi Clerk, dan panduan implementasi ini, tim dapat fokus pada pengembangan yang efisien dalam 10 hari sambil mempertahankan skalabilitas untuk peningkatan di masa depan.