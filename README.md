# Project Management Backend --- V1

A TypeScript/Express backend for a project-management application. V1
provides authentication, workspaces, projects, tasks, comments, activity
logs, notifications, file handling, meetings, chat, search, dashboard
data, and an authenticated native WebSocket layer for real-time chat.

> **V1 status:** The core REST modules have been implemented and
> manually tested. Native WebSocket authentication/connection has also
> been tested successfully. Some modules/endpoints are intentionally
> deferred for frontend integration or further testing.

------------------------------------------------------------------------

## 1. Features

### Core modules

-   User authentication and session management
-   Workspace management and workspace membership
-   Project management and project membership
-   Task management, assignment, status and priority
-   Task comments
-   Activity logs
-   Notifications
-   File uploads and file metadata
-   Meetings and meeting participants
-   Chat conversations
-   Chat members
-   Chat messages
-   Native WebSocket connection for real-time chat
-   Search
-   Dashboard aggregation

------------------------------------------------------------------------

## 2. Technology Stack

  Technology         Purpose
  ------------------ ---------------------------
  TypeScript         Backend language
  Node.js            Runtime
  Express 5          HTTP API
  PostgreSQL         Database
  Prisma 7           ORM/database access
  JWT                Authentication
  HTTP-only cookie   JWT transport
  bcrypt             Password hashing
  Zod                Validation
  Multer             Multipart file uploads
  `ws`               Native WebSocket server
  CORS               Cross-origin API access
  dotenv             Environment configuration
  Nodemon            Development server reload

The project is configured as an ES module project with
`"type": "module"`.

------------------------------------------------------------------------

## 3. Architecture

The backend follows a modular service/repository architecture.

``` text
Client
  |
  +----------------------+
  |                      |
HTTP REST             WebSocket
  |                      |
Express Router        HTTP Upgrade
  |                      |
Controller            WS Authentication
  |                      |
Service               WS Dispatcher/Handlers
  |                      |
Repository            Connection Manager
  |                      |
Prisma -----------------+
  |
PostgreSQL
```

Typical REST request flow:

``` text
Request
  -> Router
  -> Authentication middleware
  -> Controller
  -> Service
  -> Repository
  -> Prisma
  -> PostgreSQL
  -> Response
```

------------------------------------------------------------------------

## 4. Project Structure

Important directories:

``` text
backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── generated/
│   └── prisma/
│
├── src/
│   ├── config/
│   ├── infrastructure/
│   │   └── storage/
│   ├── middleware/
│   ├── module/
│   │   ├── user/
│   │   ├── work_space/
│   │   ├── project/
│   │   ├── task/
│   │   ├── comment/
│   │   ├── activity/
│   │   ├── Notification/
│   │   ├── file/
│   │   ├── meeting/
│   │   ├── chat/
│   │   ├── search/
│   │   └── dashboard/
│   ├── shared/
│   │   ├── errors/
│   │   └── util/
│   ├── websocket/
│   ├── routers/
│   ├── app.ts
│   └── server.ts
│
├── package.json
├── tsconfig.json
└── .env
```

------------------------------------------------------------------------

# 5. Environment Variables

Create a `.env` file in the backend root:

``` env
PORT=5000
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-long-random-secret"
```

### Variables

  Variable         Required   Description
  ---------------- ---------- -------------------------------------------------
  `PORT`           No         HTTP/WebSocket server port. Defaults to `5000`.
  `DATABASE_URL`   Yes        PostgreSQL connection string.
  `JWT_SECRET`     Yes        Secret used to sign/verify JWTs.

**Never commit `.env` to GitHub.**

A public repository should contain `.env.example`, not real credentials.

------------------------------------------------------------------------

# 6. Installation

## Requirements

-   Node.js
-   npm
-   PostgreSQL
-   Git

## Install dependencies

``` bash
npm install
```

## Generate Prisma client

``` bash
npx prisma generate
```

## Apply migrations

For a development database:

``` bash
npx prisma migrate dev
```

## Start development server

``` bash
npm run dev
```

The development script runs:

``` text
src/server.ts
```

using `ts-node/esm`.

## Start server

``` bash
npm start
```

The configured scripts are:

``` json
{
  "dev": "nodemon --watch src --ext ts,json --exec \"node --loader ts-node/esm\" src/server.ts",
  "start": "node --loader ts-node/esm src/server.ts"
}
```

------------------------------------------------------------------------

# 7. Server Endpoints

The Express application mounts all module routers under:

``` text
/api
```

The main router prefixes are:

``` text
/api/user
/api/project
/api/task
/api/workSpace
/api/notification
/api/activity
/api/taskComment
/api/chat
/api/file
/api/meeting
/api/search
/api/dashboard
```

Health check:

``` http
GET /health
```

Example response:

``` json
{
  "success": true,
  "message": "Server running"
}
```

------------------------------------------------------------------------

# 8. Authentication

Authentication is based on JWT.

The JWT is stored in a cookie named:

``` text
jwt
```

Authenticated REST endpoints use the `isLogin` middleware.

The authenticated user is made available to controllers through:

``` text
req.user
```

Relevant user information includes:

``` text
id
userName
role
```

## Register

``` http
POST /api/user/register
```

The registration flow creates the user and generates the authentication
cookie.

## Login

``` http
POST /api/user/login
```

Request body:

``` json
{
  "userName": "example",
  "password": "password"
}
```

## Current user

``` http
GET /api/user/fetchMe
```

Requires authentication.

## Logout

``` http
POST /api/user/logOut
```

The server clears the `jwt` cookie.

------------------------------------------------------------------------

# 9. User API

  Method   Endpoint               Auth
  -------- ---------------------- ------
  POST     `/api/user/register`   No
  POST     `/api/user/login`      No
  POST     `/api/user/logOut`     No
  GET      `/api/user/fetchMe`    Yes

------------------------------------------------------------------------

# 10. Workspace API

Workspace routes are mounted under:

``` text
/api/workSpace
```

  Method   Endpoint          Auth
  -------- ----------------- ------
  POST     `/addWorkSpace`   Yes
  GET      `/allWorkSpace`   Yes
  GET      `/getAllUser`     Yes
  PATCH    `/addUser`        Yes
  PATCH    `/removeUser`     Yes
  PATCH    `/updateRole`     Yes

### Create workspace

``` http
POST /api/workSpace/addWorkSpace
```

Body:

``` json
{
  "name": "My Workspace",
  "description": "Workspace description"
}
```

### Add workspace member

``` http
PATCH /api/workSpace/addUser
```

Body:

``` json
{
  "workSpaceId": "workspace-id",
  "userId": "user-id",
  "role": "MEMBER"
}
```

Workspace roles:

``` text
OWNER
ADMIN
MEMBER
```

------------------------------------------------------------------------

# 11. Project API

Routes:

``` text
/api/project
```

  Method   Endpoint                         Auth
  -------- -------------------------------- ------
  POST     `/createNew`                     Yes
  GET      `/getProject/:id`                Yes
  GET      `/allProjectMember/:projectId`   Yes
  DELETE   `/deleteProject/:projectId`      Yes
  DELETE   `/removeMember/:userId`          Yes
  PATCH    `/memberAdd/:projectId`          Yes
  PATCH    `/updateRole/:userId`            Yes

### Create project

``` http
POST /api/project/createNew
```

Body currently read by the controller:

``` json
{
  "name": "Project Name",
  "description": "Project description",
  "workSpaceId": "workspace-id",
  "endDate": "2026-12-31T00:00:00.000Z"
}
```

Project status values:

``` text
ACTIVE
COMPLETED
ARCHIVED
```

Project roles:

``` text
OWNER
ADMIN
MEMBER
```

------------------------------------------------------------------------

# 12. Task API

Routes:

``` text
/api/task
```

  Method   Endpoint                Auth
  -------- ----------------------- ------
  POST     `/createNew`            Yes
  GET      `/created/me`           Yes
  GET      `/assigned/me`          Yes
  GET      `/project/:projectId`   Yes
  GET      `/:id`                  Yes
  PATCH    `/:id`                  Yes
  PATCH    `/:id/status`           Yes
  PATCH    `/:id/priority`         Yes
  PATCH    `/:id/assign`           Yes
  PATCH    `/:id/unassign`         Yes
  DELETE   `/:id`                  Yes

### Create task

``` http
POST /api/task/createNew
```

Body:

``` json
{
  "title": "Implement authentication",
  "description": "Create login flow",
  "projectId": "project-id",
  "assigneeId": "user-id",
  "status": "TODO",
  "priority": "HIGH"
}
```

Optional fields can be omitted.

Task status:

``` text
TODO
IN_PROGRESS
REVIEW
DONE
```

Task priority:

``` text
LOW
MEDIUM
HIGH
CRITICAL
```

### Update status

``` http
PATCH /api/task/:id/status
```

Body:

``` json
{
  "status": "IN_PROGRESS"
}
```

### Update priority

``` http
PATCH /api/task/:id/priority
```

Body:

``` json
{
  "priority": "HIGH"
}
```

### Assign

``` http
PATCH /api/task/:id/assign
```

Body:

``` json
{
  "assigneeId": "user-id"
}
```

------------------------------------------------------------------------

# 13. Comment API

Routes:

``` text
/api/taskComment
```

  Method   Endpoint                   Auth
  -------- -------------------------- ------
  POST     `/createComment/:taskId`   Yes
  GET      `/comments`                Yes
  PATCH    `/comments/:commentId`     Yes
  DELETE   `/comments/:commentId`     Yes

### Create comment

``` http
POST /api/taskComment/createComment/:taskId
```

Body:

``` json
{
  "content": "This task is ready for review."
}
```

### Get task comments

The current controller reads the task ID from the request body:

``` json
{
  "taskId": "task-id"
}
```

------------------------------------------------------------------------

# 14. Activity API

Routes:

``` text
/api/activity
```

  Method   Endpoint                     Auth
  -------- ---------------------------- ------
  GET      `/workspaces/:workspaceId`   Yes
  GET      `/projects/:projectId`       Yes
  GET      `/tasks/:taskId`             Yes

Activity actions include:

``` text
CREATE
UPDATE
DELETE
ASSIGN
UNASSIGN
INVITE
REMOVE
ARCHIVE
RESTORE
UPLOAD
DOWNLOAD
COMMENT
LOGIN
LOGOUT
CANCEL
```

Activity target types:

``` text
WORKSPACE
PROJECT
TASK
COMMENT
FILE
CHAT
MEETING
USER
```

The activity model supports optional context IDs for workspace, project,
and task, together with:

-   actor
-   action
-   target type
-   target ID
-   description
-   metadata
-   timestamp

------------------------------------------------------------------------

# 15. Notification API

Routes:

``` text
/api/notification
```

  Method   Endpoint      Auth
  -------- ------------- ------
  GET      `/`           Yes
  PATCH    `/read-all`   Yes
  PATCH    `/:id/read`   Yes
  DELETE   `/`           Yes
  DELETE   `/:id`        Yes

Notification types currently defined include:

``` text
TASK_ASSIGNED
TASK_UPDATED
TASK_COMPLETED
PROJECT_INVITED
PROJECT_ROLE_CHANGED
PROJECT_MEMBER_REMOVE
WORKSPACE_INVITED
WORKSPACE_ROLE_CHANGED
CHAT_MESSAGE
MEETING_STARTED
MEETING_INVITED
MEETING_ENDED
MEETING_CANCELD
COMMENT_ADDED
SYSTEM
```

Example:

``` http
PATCH /api/notification/:id/read
```

marks one notification as read.

------------------------------------------------------------------------

# 16. Chat REST API

Routes:

``` text
/api/chat
```

## Conversation

  Method   Endpoint
  -------- -------------------------------------------------
  POST     `/conversation/create`
  GET      `/conversation/getAllConversations`
  GET      `/conversation/getConversation/:conversationId`
  PATCH    `/conversation/update/:conversationId`
  DELETE   `/conversation/delete/:conversationId`

## Members

  Method   Endpoint
  -------- --------------------------------------
  POST     `/member/add/:memberId`
  GET      `/member/getMembers/:conversationId`
  DELETE   `/member/removeMember/:memberShipId`

## Messages

  Method   Endpoint
  -------- -----------------------------------
  POST     `/message/sentMessage`
  GET      `/message/getAll/:conversationId`
  GET      `/message/getMessage/:messageId`
  PATCH    `/message/update/:messageId`
  DELETE   `/message/delete/:messageId`

### Send message

``` http
POST /api/chat/message/sentMessage
```

Body:

``` json
{
  "message": "Hello",
  "conversationId": "conversation-id"
}
```

Conversation types:

``` text
DIRECT
GROUP
```

Chat membership authorization is enforced by the service layer for the
tested operations.

------------------------------------------------------------------------

# 17. Native WebSocket API

The project uses the `ws` package and a manually handled HTTP upgrade.

WebSocket URL:

``` text
ws://localhost:5000
```

Use your configured `PORT` if it differs.

## Authentication

The WebSocket connection requires the same JWT cookie used by the REST
API:

``` text
Cookie: jwt=<JWT>
```

The upgrade process:

``` text
Client
  |
  | WebSocket upgrade + jwt cookie
  v
server.ts
  |
  v
authenticateWebSocket()
  |
  +-- invalid -> socket destroyed
  |
  +-- valid -> userId/userName attached
                |
                v
             WebSocketServer
```

## Connection management

`ConnectionManager` keeps an authenticated socket by user ID.

`ConversationManager` keeps sets of sockets joined to each conversation.

This allows messages to be broadcast to sockets currently joined to a
conversation.

## Current event design

The WebSocket layer is designed around JSON events with a `type` field.

The intended join event is:

``` json
{
  "type": "JOIN_CONVERSATION",
  "conversationId": "conversation-id"
}
```

Successful join response:

``` json
{
  "type": "JOIN_CONVERSATION_SUCCESS",
  "conversationId": "conversation-id"
}
```

Invalid JSON response:

``` json
{
  "type": "ERROR",
  "code": "INVALID_MESSAGE",
  "message": "Invalid WebSocket message"
}
```

Unknown events are intended to return:

``` json
{
  "type": "ERROR",
  "code": "UNKNOWN_EVENT",
  "message": "Unknown WebSocket event"
}
```

### V1 WebSocket testing status

Authenticated WebSocket connection has been successfully tested using a
Node `ws` client with the JWT cookie.

Further real-time chat event testing is planned during React frontend
integration.

> **Implementation note:** The current dispatcher source contains a
> duplicate `JOIN_CONVERSATION` switch case, so the WebSocket event
> dispatcher should be cleaned up before relying on all real-time
> events. The REST chat API remains the primary tested chat interface
> for V1.

------------------------------------------------------------------------

# 18. File API

Routes:

``` text
/api/file
```

  Method   Endpoint                    Upload
  -------- --------------------------- --------
  POST     `/task/:taskId`             `file`
  POST     `/workspace/:workSpaceId`   `file`
  POST     `/project/:projectId`       `file`
  POST     `/comment/:commentId`       `file`
  GET      `/:fileId`                  No
  GET      `/task/:taskId`             No
  GET      `/workspace/:workSpaceId`   No
  GET      `/project/:projectId`       No

Uploads use:

``` text
multipart/form-data
```

with field name:

``` text
file
```

The database stores metadata such as:

-   original filename
-   stored filename
-   MIME type
-   size
-   storage key
-   uploader
-   optional workspace
-   optional project
-   optional task
-   optional comment

The current storage infrastructure includes local storage.

------------------------------------------------------------------------

# 19. Meeting API

Routes currently exposed:

``` text
/api/meeting
```

  Method   Endpoint
  -------- -----------------------------
  GET      `/getMeeting/:meetingId`
  POST     `/createMeeting`
  POST     `/updateMeeting/:meetingId`
  POST     `/startMeeting/:meetingId`
  POST     `/endMeeting/:meetingId`

The database supports:

-   meeting title
-   description
-   scheduled time
-   status
-   start/end timestamps
-   meeting URL
-   organizer
-   workspace
-   optional project
-   participants

Meeting status:

``` text
SCHEDULED
LIVE
COMPLETED
CANCELLED
```

The controller also contains cancellation and participant functions, but
those functions are not currently exposed by the shown meeting router.
They should therefore not be treated as public API endpoints until
routes are added and tested.

------------------------------------------------------------------------

# 20. Search API

``` http
GET /api/search/allSearch
```

Authentication is required.

The controller reads the optional query parameter:

``` text
query
```

Example:

``` text
GET /api/search/allSearch?query=project
```

The current controller requests a limit of 10 results.

------------------------------------------------------------------------

# 21. Dashboard API

``` http
GET /api/dashboard/getAllDashboard
```

Authentication is required.

The endpoint delegates aggregation to `DashboardService`.

The dashboard is intended to provide application-level summary
information for the authenticated user.

------------------------------------------------------------------------

# 22. Database Design

The Prisma schema currently contains these main models:

``` text
User
Workspace
WorkspaceMember
Project
ProjectMember
Task
Notification
Activity
Comment
File
Meeting
MeetingParticipant
Conversation
ConversationMembers
Message
```

### Main relationships

``` text
User
 ├── Workspaces owned
 ├── Workspace memberships
 ├── Projects owned
 ├── Project memberships
 ├── Created tasks
 ├── Assigned tasks
 ├── Comments
 ├── Notifications
 ├── Activities
 ├── Uploaded files
 ├── Meetings organized
 ├── Meeting participation
 ├── Conversations
 ├── Conversation memberships
 └── Messages
```

``` text
Workspace
 ├── Members
 ├── Projects
 ├── Files
 ├── Meetings
 └── Activities
```

``` text
Project
 ├── Workspace
 ├── Members
 ├── Tasks
 ├── Files
 └── Meetings
```

``` text
Task
 ├── Project
 ├── Creator
 ├── Assignee
 ├── Comments
 ├── Files
 └── Activities
```

``` text
Conversation
 ├── Members
 └── Messages
```

------------------------------------------------------------------------

# 23. Prisma Enums

## Role

``` text
admin
systemAdmin
user
```

## WorkspaceRole

``` text
OWNER
ADMIN
MEMBER
```

## ProjectStatus

``` text
ACTIVE
COMPLETED
ARCHIVED
```

## ProjectRole

``` text
OWNER
ADMIN
MEMBER
```

## TaskStatus

``` text
TODO
IN_PROGRESS
REVIEW
DONE
```

## TaskPriority

``` text
LOW
MEDIUM
HIGH
CRITICAL
```

## ConversationType

``` text
DIRECT
GROUP
```

------------------------------------------------------------------------

# 24. Error Handling

The project contains shared error classes and centralized error
middleware.

Controllers are generally wrapped with:

``` text
asyncHandler(...)
```

This allows rejected async operations to reach the central error
middleware instead of requiring repeated try/catch blocks in every
controller.

The project includes shared errors such as:

``` text
AppError
UnauthorizedError
ForbiddenError
NotFoundError
```

The intended authorization model is:

``` text
Authentication
    ->
Authorization
    ->
Business operation
```

------------------------------------------------------------------------

# 25. Security

Current security-related mechanisms include:

-   JWT authentication
-   HTTP-only authentication cookie generation
-   bcrypt password hashing
-   authenticated REST routes
-   WebSocket authentication during HTTP upgrade
-   service-level membership/authorization checks
-   centralized error handling

## Important production improvements

Before production deployment, review:

-   production CORS configuration
-   cookie `secure` option
-   cookie `sameSite` policy
-   JWT expiration/refresh strategy
-   rate limiting
-   request validation coverage
-   file type and file size restrictions
-   security headers
-   logging policy
-   secret management
-   database connection security
-   WebSocket event validation

------------------------------------------------------------------------

# 26. Testing Status --- V1

The following modules have been manually tested successfully during V1
development:

  Module                                Status
  ------------------------------------- ---------------------------
  User authentication                   Tested
  Workspace                             Tested
  Project                               Tested
  Task                                  Tested
  Comment                               Tested
  Activity                              Tested
  Notification                          Tested
  Chat REST                             Tested
  WebSocket authentication/connection   Tested
  File                                  Deferred/partially tested
  Search                                Deferred
  Meeting                               Further testing needed
  Dashboard                             Further testing needed

### Chat REST tests completed

The tested chat flow included:

-   create conversation
-   get conversations
-   get conversation
-   update conversation
-   add member
-   get members
-   remove member
-   send message
-   get all messages
-   get one message
-   update message
-   delete message

Authorization cases were also tested for relevant chat operations.

------------------------------------------------------------------------

# 27. Known V1 Cleanup Items

The current source should be cleaned before the first public GitHub
release.

Important examples found in the V1 source:

1.  Some controllers contain debug `console.log()` statements.
2.  Some imports are unused.
3.  The WebSocket dispatcher contains a duplicate `JOIN_CONVERSATION`
    case.
4.  The meeting controller contains functions that are not currently
    routed.
5.  The file router currently maps the workspace/project upload paths to
    `uploadTaskFile`; this should be reviewed before treating those
    endpoints as final.
6.  Some response property names contain spelling inconsistencies such
    as `satus` and `sucess`.
7.  Some endpoints use `201` for operations that would conventionally
    use `200`.
8.  Validation should be reviewed consistently across every module.
9.  The current WebSocket protocol should be expanded and tested from
    the React frontend.

These are documented as cleanup items rather than silently changing the
V1 implementation.

------------------------------------------------------------------------

# 28. Recommended GitHub Preparation

Before the first push:

``` bash
git status
```

Make sure `.env` and other secrets are ignored.

Recommended `.gitignore` entries:

``` gitignore
node_modules/
.env
.env.*
!.env.example
dist/
coverage/
*.log
.DS_Store
```

Then create an example environment file:

``` env
PORT=5000
DATABASE_URL=
JWT_SECRET=
```

Check the repository:

``` bash
git status
```

Then:

``` bash
git add .
git commit -m "feat: complete backend v1"
```

After creating the GitHub repository:

``` bash
git remote add origin <YOUR_GITHUB_REPOSITORY>
git branch -M main
git push -u origin main
```

Do not put real passwords, JWT secrets, database credentials, private
keys, or uploaded private files into the repository.

------------------------------------------------------------------------

# 29. V1 Development Roadmap

``` text
Backend V1
    |
    +-- REST API
    |    +-- User
    |    +-- Workspace
    |    +-- Project
    |    +-- Task
    |    +-- Comment
    |    +-- Activity
    |    +-- Notification
    |    +-- Chat
    |    +-- File
    |    +-- Meeting
    |    +-- Search
    |    +-- Dashboard
    |
    +-- WebSocket
         +-- Authentication
         +-- Connection management
         +-- Conversation membership
         +-- Real-time messaging
```

After V1 backend closure:

``` text
Figma UI
   ->
React + Tailwind
   ->
REST API integration
   ->
WebSocket integration
   ->
Frontend testing
   ->
V2 improvements
```

------------------------------------------------------------------------

# 30. Development Philosophy

The backend is structured so that business logic stays primarily inside
services while controllers remain responsible for translating HTTP
requests into service calls.

The intended separation is:

``` text
Controller
    = HTTP concerns

Service
    = business rules

Repository
    = database operations

Prisma
    = database access layer

Middleware
    = authentication/error/request concerns
```

This structure makes the backend suitable for later React web
integration and a future mobile client using the same API.

------------------------------------------------------------------------

# 31. Current V1 Definition of Done

V1 backend is considered functionally complete for the current
development stage when:

-   [x] User authentication implemented
-   [x] Workspace implemented
-   [x] Project implemented
-   [x] Task implemented
-   [x] Comment implemented
-   [x] Activity implemented
-   [x] Notification implemented
-   [x] Chat REST implemented
-   [x] WebSocket authentication implemented
-   [x] WebSocket connection tested
-   [ ] WebSocket event integration tested from React
-   [ ] Final cleanup
-   [ ] `.env.example`
-   [ ] Final README review
-   [ ] Initial Git commit
-   [ ] GitHub V1 push

The remaining WebSocket event work belongs naturally to the frontend
integration phase.

------------------------------------------------------------------------

## License

The current `package.json` declares the project license as:

``` text
ISC
```

If this project will become a commercial product, review and choose the
final license before public release.
