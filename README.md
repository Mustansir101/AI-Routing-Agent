# AI Routing System - Technical README

A full-stack AI routing system that intelligently routes natural language queries to appropriate tools using Gemini LLM and MongoDB.

## 🛠️ Tech Stack

| Layer        | Technology                                                  |
| ------------ | ----------------------------------------------------------- |
| **Frontend** | React 19, Next.js 16 (App Router), TypeScript, Tailwind CSS |
| **Backend**  | Next.js API Routes, TypeScript                              |
| **LLM**      | Google Gemini 2.5 Flash (Function Calling)                  |
| **Database** | MongoDB (Node.js MongoDB Driver)                            |

## 📋 Project Flow

```
User Query → Gemini LLM → MCP Router → Tool Selection → MongoDB/Mock Data → English Response
```

## 🔧 Available Tools

### 1. Weather Tool

**Purpose**: Get weather information for any location

**Input**:

```json
{
  "toolName": "weather_tool",
  "arguments": {
    "location": "London"
  }
}
```

**Output**:

```json
{
  "answer": "The current weather in London is 12°C with cloudy with light rain."
}
```

**Mock Data** (5 cities):

- London: 12°C, cloudy with light rain
- San Francisco: 18°C, clear skies
- New York: 8°C, partly cloudy
- Tokyo: 15°C, sunny
- Paris: 10°C, overcast

---

### 2. Database Tool

**Purpose**: Query MongoDB employee database

**Input Types**:

#### a) Count All Employees

```json
{
  "toolName": "database_tool",
  "arguments": {
    "query_type": "count_all"
  }
}
```

**Output**: `"There are X employees in total in the company."`

#### b) Count Recent Hires

```json
{
  "toolName": "database_tool",
  "arguments": {
    "query_type": "count_recent",
    "time_period": "last_month"
  }
}
```

**Output**: `"There were X employees who joined last month."`

#### c) List All Employees

```json
{
  "toolName": "database_tool",
  "arguments": {
    "query_type": "list_all"
  }
}
```

**Output**: `"The employees in the company are: Alice Johnson, Bob Smith, ..."`

#### d) Count by Department

```json
{
  "toolName": "database_tool",
  "arguments": {
    "query_type": "count_by_department",
    "department": "Engineering"
  }
}
```

**Output**: `"There are X employees in the Engineering department."`

---

## 📊 MongoDB Schema

**Database**: `company`  
**Collection**: `employees`

```json
{
  "_id": ObjectId,
  "name": "string",
  "department": "string",
  "joinDate": ISODate
}
```

**Sample Document**:

```json
{
  "name": "Alice Johnson",
  "department": "Engineering",
  "joinDate": ISODate("2024-11-15")
}
```

---

## 📡 API Endpoint

**URL**: `POST /api/ask`

**Request**:

```json
{
  "query": "What's the weather in London?"
}
```

**Response**:

```json
{
  "answer": "The current weather in London is 12°C with cloudy with light rain."
}
```

**Error Response**:

```json
{
  "error": "Error message describing what went wrong"
}
```

---

## 🔄 Internal JSON Flow

### Step 1: User Query

```json
{
  "query": "How many employees joined last month?"
}
```

### Step 2: Gemini LLM Output

```json
{
  "toolName": "database_tool",
  "arguments": {
    "query_type": "count_recent",
    "time_period": "last_month"
  }
}
```

### Step 3: MCP Router Routes to Tool

- Validates `toolName` and `arguments`
- Calls appropriate tool function
- Handles errors gracefully

### Step 4: Tool Execution Returns English

```json
{
  "answer": "There were 3 employees who joined last month."
}
```

---

## 📁 Project Structure

```
app/
├── api/ask/
│   └── route.ts          # Main API endpoint, LLM, MCP Router, Tools
├── page.tsx              # UI interface
└── layout.tsx

.env.local                # Environment variables (create this)
.env.example              # Template
package.json
```

---

## 🔑 Environment Variables

```bash
# .env.local

# Gemini API Configuration
GEMINI_API_KEY=sk-...

# MongoDB Configuration
# Local: mongodb://localhost:27017
# Atlas: mongodb+srv://user:pass@cluster.mongodb.net
MONGODB_URI=mongodb://localhost:27017
```

---

## 💻 Example Queries

| User Query                      | Tool                                | Output                                                   |
| ------------------------------- | ----------------------------------- | -------------------------------------------------------- |
| "What's the weather in London?" | weather_tool                        | "The current weather in London is 12°C with cloudy..."   |
| "How many employees are there?" | database_tool (count_all)           | "There are 6 employees in total in the company."         |
| "How many joined last month?"   | database_tool (count_recent)        | "There were 3 employees who joined last month."          |
| "List all employees"            | database_tool (list_all)            | "The employees in the company are: Alice, Bob, Carol..." |
| "How many in Engineering?"      | database_tool (count_by_department) | "There are 3 employees in the Engineering department."   |

---

## 🏗️ Architecture Breakdown

### LLM Integration (`getLLMRouting`)

- Uses Gemini 2.5 Flash API
- Temperature: 0.1 (deterministic)
- Max tokens: 256
- Returns structured JSON with `toolName` and `arguments`
- Handles markdown formatting cleanup

### MCP Router (`mcpRouter`)

- Simple switch statement routing
- Calls appropriate tool based on `toolName`
- Passes `arguments` to tool function
- Returns clean English responses

### Tool Functions

- **weatherTool**: Synchronous, searches mock data object
- **databaseTool**: Asynchronous, connects to MongoDB
  - Uses `MongoClient` for connection
  - Executes MongoDB queries: `countDocuments()`, `find()`
  - Returns formatted English strings

---

## 🔌 MongoDB Setup

### Option 1: Local MongoDB

```bash
# Download: https://www.mongodb.com/try/download/community
# Start service
mongod

# Connection string
mongodb://localhost:27017
```

### Option 2: MongoDB Atlas (Cloud)

```
https://www.mongodb.com/cloud/atlas
1. Create free account
2. Create cluster
3. Copy connection string
4. Add to .env.local
```

### Add Sample Data

```javascript
// MongoDB Shell
use company

db.employees.insertMany([
  {
    name: "Alice Johnson",
    department: "Engineering",
    joinDate: new Date("2024-11-15")
  },
  // ... more employees
])
```

See `MONGODB-SETUP.md` for detailed instructions.

---

## ✅ Features

✅ Single API endpoint with intelligent routing  
✅ Gemini LLM for natural language processing  
✅ MongoDB for persistent data storage  
✅ Two distinct tools: Weather & Database  
✅ Clean English responses (no raw data/SQL exposed)  
✅ Error handling and graceful fallbacks  
✅ Beautiful responsive UI with examples  
✅ Type-safe TypeScript implementation

---

## 🐛 Troubleshooting

| Error                                  | Solution                                               |
| -------------------------------------- | ------------------------------------------------------ |
| "Gemini API key not configured"        | Add `GEMINI_API_KEY` to `.env.local` and restart       |
| "MongoDB URI not configured"           | Add `MONGODB_URI` to `.env.local` and restart          |
| "Connection refused"                   | Ensure MongoDB is running or Atlas connection is valid |
| "Failed to parse routing instructions" | Check Gemini API response format                       |

---

## 📦 Dependencies

```json
{
  "next": "16.0.7",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "mongodb": "^6.x",
  "typescript": "^5"
}
```

---

## 🎯 Assignment Requirements Met

✅ Single full-stack API endpoint  
✅ LLM-based intelligent routing  
✅ MCP Router with tool selection logic  
✅ Weather Tool implementation  
✅ Database Tool with MongoDB integration  
✅ Clean English output (no raw data)  
✅ Complete error handling  
✅ Production-ready architecture

---

## 📝 For More Details

- **Architecture Diagram**: See `ARCHITECTURE.md`
- **MongoDB Setup**: See `MONGODB-SETUP.md`
- **Technical Deep Dive**: See `TECHNICAL-DOCS.md`
- **Quick Setup**: See `QUICKSTART.md`

---

**Status**: ✅ Ready for Production | Last Updated: Dec 2025
