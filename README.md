# AI Routing System - Technical README

A full-stack AI routing system that intelligently routes natural language queries to appropriate tools using Gemini LLM and MongoDB.

## 🛠️ Tech Stack

| Layer        | Technology                             |
| ------------ | -------------------------------------- |
| **Frontend** | Next.js 16                             |
| **Backend**  | Next.js API Routes                     |
| **LLM**      | Google Gemini 2.5 Flash (Tool Calling) |
| **Database** | MongoDB                                |

## 📋 Project Overview

The AI Routing System is designed to process natural language queries and route them to the appropriate tools for execution. It provides clean, user-friendly responses based on the query type.

### Key Features:

1. **Natural Language Query Handling**:
   - Users can input queries like "What's the weather in London?" or "How many employees are in the Engineering department?".
   - The system uses the Gemini LLM to interpret the query and determine the appropriate tool to handle it.

2. **Tool-Based Query Execution**:
   - **Weather Tool**: Provides weather information for specific locations using mock data.
   - **Database Tool**: Queries a MongoDB database to retrieve employee-related data (e.g., total employees, recent hires, department counts).

3. **Single API Endpoint**:
   - The `/api/ask` endpoint processes user queries, routes them to the correct tool, and returns a clean English response.

4. **Frontend**:
   - A responsive UI built with **React**, **Next.js**, and **Tailwind CSS** allows users to input queries and view results.

5. **Backend**:
   - Implements routing logic (`MCP Router`) to call the appropriate tool based on the LLM's output.

6. **Mock Data and MongoDB Integration**:
   - Weather data is mocked for various cities.
   - Employee data is stored in a MongoDB database with a predefined schema.

## 📊 Project Flow

1. **User Query** →
2. **Gemini LLM** (interprets query) →
3. **MCP Router** (routes to the correct tool) →
4. **Tool Execution** (e.g., fetch weather or query database) →
5. **English Response** (returned to the user).

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

## 💻 Example Queries

| User Query                      | Tool                                | Output                                                   |
| ------------------------------- | ----------------------------------- | -------------------------------------------------------- |
| "What's the weather in London?" | weather_tool                        | "The current weather in London is 12°C with cloudy..."   |
| "How many employees are there?" | database_tool (count_all)           | "There are 6 employees in total in the company."         |
| "How many joined last month?"   | database_tool (count_recent)        | "There were 3 employees who joined last month."          |
| "List all employees"            | database_tool (list_all)            | "The employees in the company are: Alice, Bob, Carol..." |
| "How many in Engineering?"      | database_tool (count_by_department) | "There are 3 employees in the Engineering department."   |

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
