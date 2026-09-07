# Project Management Backend V1 --- API Reference

Base URL:

``` text
http://localhost:5000
```

Change the port to match `PORT` in `.env`.

All authenticated endpoints require the JWT authentication cookie:

``` text
jwt=<JWT>
```

## Response convention

Most endpoints return a JSON object containing:

``` json
{
  "status": true,
  "data": {}
}
```

Some endpoints return a `message` instead of or in addition to `data`.

------------------------------------------------------------------------

## Authentication

### POST `/api/user/register`

Registers a user and generates the authentication cookie.

### POST `/api/user/login`

Body:

``` json
{
  "userName": "username",
  "password": "password"
}
```

### GET `/api/user/fetchMe`

Returns the currently authenticated user.

### POST `/api/user/logOut`

Clears the `jwt` authentication cookie.

------------------------------------------------------------------------

## Workspace

### POST `/api/workSpace/addWorkSpace`

Body:

``` json
{
  "name": "Workspace",
  "description": "Description"
}
```

### GET `/api/workSpace/allWorkSpace`

Route is registered and requires authentication. The current route does
not attach a controller in the router.

### GET `/api/workSpace/getAllUser`

Body currently expected by the controller:

``` json
{
  "id": "workspace-id"
}
```

### PATCH `/api/workSpace/addUser`

Body:

``` json
{
  "workSpaceId": "workspace-id",
  "userId": "user-id",
  "role": "MEMBER"
}
```

### PATCH `/api/workSpace/removeUser`

Body:

``` json
{
  "memberShipId": "membership-id",
  "workSpaceId": "workspace-id"
}
```

### PATCH `/api/workSpace/updateRole`

Body:

``` json
{
  "memberShipId": "membership-id",
  "role": "ADMIN",
  "workSpaceId": "workspace-id"
}
```

------------------------------------------------------------------------

## Project

### POST `/api/project/createNew`

Body:

``` json
{
  "name": "Project",
  "description": "Description",
  "workSpaceId": "workspace-id",
  "endDate": "2026-12-31T00:00:00.000Z"
}
```

### GET `/api/project/getProject/:id`

Returns one project.

### GET `/api/project/allProjectMember/:projectId`

Returns project members through the project service.

> The current controller source shown in V1 does not send a response
> after calling the service. Review before frontend integration.

### DELETE `/api/project/deleteProject/:projectId`

Deletes a project if the authenticated user is authorized.

### DELETE `/api/project/removeMember/:userId`

Body:

``` json
{
  "projectId": "project-id"
}
```

### PATCH `/api/project/memberAdd/:projectId`

Body:

``` json
{
  "userId": "user-id",
  "role": "MEMBER"
}
```

### PATCH `/api/project/updateRole/:userId`

Body:

``` json
{
  "projectId": "project-id",
  "role": "ADMIN"
}
```

------------------------------------------------------------------------

## Tasks

### POST `/api/task/createNew`

Body:

``` json
{
  "title": "Task",
  "description": "Description",
  "projectId": "project-id",
  "assigneeId": "user-id",
  "status": "TODO",
  "priority": "MEDIUM"
}
```

### GET `/api/task/created/me`

Returns tasks created by the current user.

### GET `/api/task/assigned/me`

Returns tasks assigned to the current user.

### GET `/api/task/project/:projectId`

Returns project tasks.

### GET `/api/task/:id`

Returns one task.

### PATCH `/api/task/:id`

Body can contain:

``` json
{
  "title": "Updated task",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "projectId": "project-id",
  "assigneeId": "user-id"
}
```

### PATCH `/api/task/:id/status`

Body:

``` json
{
  "status": "DONE"
}
```

### PATCH `/api/task/:id/priority`

Body:

``` json
{
  "priority": "CRITICAL"
}
```

### PATCH `/api/task/:id/assign`

Body:

``` json
{
  "assigneeId": "user-id"
}
```

### PATCH `/api/task/:id/unassign`

Unassigns the task.

### DELETE `/api/task/:id`

Deletes the task.

------------------------------------------------------------------------

## Comments

### POST `/api/taskComment/createComment/:taskId`

Body:

``` json
{
  "content": "Comment text"
}
```

### GET `/api/taskComment/comments`

Current controller reads:

``` json
{
  "taskId": "task-id"
}
```

from the request body.

### PATCH `/api/taskComment/comments/:commentId`

Body:

``` json
{
  "content": "Updated comment"
}
```

### DELETE `/api/taskComment/comments/:commentId`

Deletes a comment.

------------------------------------------------------------------------

## Activity

### GET `/api/activity/workspaces/:workspaceId`

Returns workspace activities.

### GET `/api/activity/projects/:projectId`

Returns project activities.

### GET `/api/activity/tasks/:taskId`

Returns task activities.

------------------------------------------------------------------------

## Notifications

### GET `/api/notification/`

Gets notifications for the authenticated user.

### PATCH `/api/notification/read-all`

Marks all notifications as read.

### PATCH `/api/notification/:id/read`

Marks one notification as read.

### DELETE `/api/notification/`

Deletes all notifications.

### DELETE `/api/notification/:id`

Deletes one notification.

------------------------------------------------------------------------

## Chat

### POST `/api/chat/conversation/create`

Creates a conversation.

### GET `/api/chat/conversation/getAllConversations`

Gets conversations belonging to the authenticated user.

### GET `/api/chat/conversation/getConversation/:conversationId`

Gets one conversation.

### PATCH `/api/chat/conversation/update/:conversationId`

Body:

``` json
{
  "name": "New conversation name"
}
```

### DELETE `/api/chat/conversation/delete/:conversationId`

Deletes a conversation.

### POST `/api/chat/member/add/:memberId`

Body:

``` json
{
  "conversationId": "conversation-id"
}
```

### GET `/api/chat/member/getMembers/:conversationId`

Gets conversation members.

### DELETE `/api/chat/member/removeMember/:memberShipId`

Removes a conversation membership.

### POST `/api/chat/message/sentMessage`

Body:

``` json
{
  "message": "Hello",
  "conversationId": "conversation-id"
}
```

### GET `/api/chat/message/getAll/:conversationId`

Gets all messages for a conversation.

### GET `/api/chat/message/getMessage/:messageId`

Gets one message.

### PATCH `/api/chat/message/update/:messageId`

Body:

``` json
{
  "message": "Updated message"
}
```

### DELETE `/api/chat/message/delete/:messageId`

Deletes one message.

------------------------------------------------------------------------

## Files

All file uploads use:

``` text
multipart/form-data
```

Field:

``` text
file
```

### POST `/api/file/task/:taskId`

Uploads a task file.

### POST `/api/file/workspace/:workSpaceId`

Workspace upload route.

### POST `/api/file/project/:projectId`

Project upload route.

### POST `/api/file/comment/:commentId`

Comment upload route.

### GET `/api/file/:fileId`

Gets file metadata.

### GET `/api/file/task/:taskId`

Gets task files.

### GET `/api/file/workspace/:workSpaceId`

Gets workspace files.

### GET `/api/file/project/:projectId`

Gets project files.

> Review the current file router before frontend integration: the
> workspace/project upload routes are mapped to the task-upload
> controller in the V1 source.

------------------------------------------------------------------------

## Meetings

### GET `/api/meeting/getMeeting/:meetingId`

Gets a meeting.

### POST `/api/meeting/createMeeting`

Body fields currently read by the controller:

``` json
{
  "schedule": "2026-12-31T10:00:00.000Z",
  "title": "Project meeting",
  "workSaceId": "workspace-id",
  "description": "Meeting description",
  "meetingUrl": "https://example.com/meeting",
  "projectId": "project-id"
}
```

### POST `/api/meeting/updateMeeting/:meetingId`

Body:

``` json
{
  "meetingUrl": "https://example.com/meeting",
  "projectId": "project-id",
  "description": "Updated description",
  "title": "Updated title",
  "scheduledAt": "2026-12-31T11:00:00.000Z"
}
```

### POST `/api/meeting/startMeeting/:meetingId`

Starts a meeting.

### POST `/api/meeting/endMeeting/:meetingId`

Ends a meeting.

The controller contains cancellation and participant functions that are
not currently registered in the shown router.

------------------------------------------------------------------------

## Search

### GET `/api/search/allSearch`

Query parameter:

``` text
query
```

Example:

``` text
GET /api/search/allSearch?query=library
```

The current controller requests a maximum of 10 results.

------------------------------------------------------------------------

## Dashboard

### GET `/api/dashboard/getAllDashboard`

Returns dashboard data for the authenticated user.

------------------------------------------------------------------------

## Health

### GET `/health`

Response:

``` json
{
  "success": true,
  "message": "Server running"
}
```

------------------------------------------------------------------------

## WebSocket

Connect to:

``` text
ws://localhost:5000
```

Authentication requires:

``` text
Cookie: jwt=<JWT>
```

Current intended event:

``` json
{
  "type": "JOIN_CONVERSATION",
  "conversationId": "conversation-id"
}
```

Success:

``` json
{
  "type": "JOIN_CONVERSATION_SUCCESS",
  "conversationId": "conversation-id"
}
```

Invalid JSON:

``` json
{
  "type": "ERROR",
  "code": "INVALID_MESSAGE",
  "message": "Invalid WebSocket message"
}
```

Unknown event:

``` json
{
  "type": "ERROR",
  "code": "UNKNOWN_EVENT",
  "message": "Unknown WebSocket event"
}
```

The real-time event protocol should be finalized during React frontend
integration.
