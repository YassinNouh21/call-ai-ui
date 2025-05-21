SaaS Agent Integration Platform
 1.0.0 
OAS 3.1
/api/v1/openapi.json
API for a multi-tenant platform that integrates with third-party AI agents.


Authorize
authentication


GET
/api/v1/auth/me
Get Current User Info


Returns information about the currently authenticated user.

Parameters
Cancel
No parameters

Execute
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "email": "user@example.com",
  "id": "string",
  "global_role": "string",
  "created_at": "2025-05-19T22:48:50.056Z"
}
No links
organizations


GET
/api/v1/organizations/orgs
Get Organizations


Get all organizations the current user has access to.

Parameters
Cancel
No parameters

Execute
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
[
  {
    "name": "string",
    "id": "string",
    "created_at": "2025-05-19T22:48:50.057Z"
  }
]
No links

POST
/api/v1/organizations/orgs
Create Organization


Create a new organization and make the creator an admin.

Parameters
Cancel
No parameters

Request body

application/json
{
  "name": "string"
}
Execute
Responses
Code	Description	Links
201	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "name": "string",
  "id": "string",
  "created_at": "2025-05-19T22:48:50.058Z"
}
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

GET
/api/v1/organizations/orgs/{org_id}
Get Organization


Get organization details if the user has access.

Parameters
Cancel
Name	Description
org_id *
string($uuid)
(path)
org_id
Execute
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "name": "string",
  "id": "string",
  "created_at": "2025-05-19T22:48:50.059Z"
}
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

PUT
/api/v1/organizations/orgs/{org_id}
Update Organization


Update organization details if user has editor role or is super_admin.

Parameters
Cancel
Name	Description
org_id *
string($uuid)
(path)
org_id
Request body

application/json
{
  "name": "string"
}
Execute
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "name": "string",
  "id": "string",
  "created_at": "2025-05-19T22:48:50.061Z"
}
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

GET
/api/v1/organizations/orgs/{org_id}/members
Get Organization Members


Get all members of an organization if the user has access.

Parameters
Cancel
Name	Description
org_id *
string($uuid)
(path)
org_id
Execute
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
[
  {
    "id": "string",
    "email": "user@example.com",
    "org_role": "string"
  }
]
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

POST
/api/v1/organizations/orgs/{org_id}/members
Add Organization Member


Add a member to an organization.

If the user already exists, they will be added to the organization. If the user doesn't exist, a new user with a temporary password will be created.

Requires:

super_admin or
organization editor role
Parameters
Cancel
Name	Description
org_id *
string($uuid)
(path)
org_id
Request body

application/json
{
  "org_role": "viewer",
  "email": "user@example.com"
}
Execute
Responses
Code	Description	Links
201	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
"string"
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

PATCH
/api/v1/organizations/orgs/{org_id}/members/{member_id}
Update Member Role


Update a member's role in an organization.

Requires:

super_admin or
organization editor role
Parameters
Cancel
Name	Description
org_id *
string($uuid)
(path)
org_id
member_id *
string($uuid)
(path)
member_id
Request body

application/json
{
  "org_role": "viewer"
}
Execute
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
"string"
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

DELETE
/api/v1/organizations/orgs/{org_id}/members/{member_id}
Remove Member


Remove a member from an organization.

Requires:

super_admin or
organization editor role
Parameters
Cancel
Name	Description
org_id *
string($uuid)
(path)
org_id
member_id *
string($uuid)
(path)
member_id
Execute
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
"string"
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links
agents


GET
/api/v1/agents/
Get Agents


Get all agents accessible to the current user.

By default, only active agents are returned. If active_only=False, all accessible agents are returned.

Super admins can see all agents. Regular users can only see agents assigned to organizations they are members of.

Parameters
Cancel
Name	Description
active_only
boolean
(query)

true
Execute
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
[
  {
    "name": "string",
    "external_agent_id": "string",
    "id": "string",
    "created_by": "string",
    "is_active": true,
    "created_at": "2025-05-19T22:48:50.068Z"
  }
]
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

POST
/api/v1/agents/
Create Agent


Create a new agent (super_admin only).

Parameters
Cancel
No parameters

Request body

application/json
{
  "name": "string",
  "external_agent_id": "string",
  "is_active": true
}
Execute
Responses
Code	Description	Links
201	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "name": "string",
  "external_agent_id": "string",
  "id": "string",
  "created_by": "string",
  "is_active": true,
  "created_at": "2025-05-19T22:48:50.070Z"
}
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

GET
/api/v1/agents/{agent_id}
Get Agent


Get agent details with all its versions.

Parameters
Cancel
Name	Description
agent_id *
string($uuid)
(path)
agent_id
Execute
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "name": "string",
  "external_agent_id": "string",
  "id": "string",
  "created_by": "string",
  "is_active": true,
  "created_at": "2025-05-19T22:48:50.071Z",
  "versions": []
}
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

PUT
/api/v1/agents/{agent_id}
Update Agent


Update an agent (super_admin only).

Parameters
Cancel
Name	Description
agent_id *
string($uuid)
(path)
agent_id
Request body

application/json
{
  "name": "string",
  "is_active": true
}
Execute
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "name": "string",
  "external_agent_id": "string",
  "id": "string",
  "created_by": "string",
  "is_active": true,
  "created_at": "2025-05-19T22:48:50.073Z"
}
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

POST
/api/v1/agents/{agent_id}/versions
Create Agent Version


Create a new version for an agent (super_admin only).

Parameters
Cancel
Name	Description
agent_id *
string($uuid)
(path)
agent_id
Request body

application/json
{
  "version": "string",
  "input_schema": {
    "additionalProp1": {}
  },
  "output_schema": {
    "additionalProp1": {}
  }
}
Execute
Responses
Code	Description	Links
201	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "version": "string",
  "input_schema": {
    "additionalProp1": {}
  },
  "output_schema": {
    "additionalProp1": {}
  },
  "id": "string",
  "agent_id": "string",
  "created_at": "2025-05-19T22:48:50.074Z"
}
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

GET
/api/v1/agents/organizations/{org_id}/agents
Get Organization Agents


Get all agents assigned to an organization that the user has access to.

Access is granted if:

User is super_admin
User is org admin
Agent is visible AND:
Access mode is 'role' and user's role is in allowed_roles
Access mode is 'member' and user is in allowed_members
Parameters
Cancel
Name	Description
org_id *
string($uuid)
(path)
org_id
Execute
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
[
  {
    "name": "string",
    "external_agent_id": "string",
    "id": "string",
    "created_by": "string",
    "is_active": true,
    "created_at": "2025-05-19T22:48:50.076Z"
  }
]
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

POST
/api/v1/agents/assign
Assign Agent To Organization


Assign an agent to an organization.

Requires:

super_admin
Parameters
Cancel
No parameters

Request body

application/json
{
  "agent_id": "string",
  "org_id": "string",
  "display_name": "string",
  "is_visible": true,
  "allowed_roles": [
    "admin",
    "editor",
    "viewer"
  ],
  "access_mode": "role"
}
Execute
Responses
Code	Description	Links
201	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "agent_id": "string",
  "org_id": "string",
  "display_name": "string",
  "is_visible": true,
  "allowed_roles": [
    "admin",
    "editor",
    "viewer"
  ],
  "access_mode": "role",
  "id": "string",
  "assigned_by": "string",
  "allowed_member_ids": [
    "string"
  ]
}
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

DELETE
/api/v1/agents/orgs/{org_id}/agents/{agent_id}
Remove Agent From Organization


Remove an agent from an organization.

Requires:

super_admin OR
organization admin
Parameters
Cancel
Name	Description
org_id *
string($uuid)
(path)
org_id
agent_id *
string($uuid)
(path)
agent_id
Execute
Responses
Code	Description	Links
204	
Successful Response

No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

PUT
/api/v1/agents/organizations/{org_id}/agents/{agent_id}
Update Organization Agent


Update organization-specific settings for an agent.

Requires:

super_admin OR
organization admin
Can update:

display_name
visibility
access mode (role/member)
allowed roles (if mode is 'role')
allowed members (if mode is 'member')
Parameters
Cancel
Name	Description
org_id *
string($uuid)
(path)
org_id
agent_id *
string($uuid)
(path)
agent_id
Request body

application/json
{
  "display_name": "string",
  "is_visible": true,
  "allowed_roles": [
    "string"
  ],
  "access_mode": "role",
  "allowed_member_ids": [
    "string"
  ]
}
Execute
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "agent_id": "string",
  "org_id": "string",
  "display_name": "string",
  "is_visible": true,
  "allowed_roles": [
    "admin",
    "editor",
    "viewer"
  ],
  "access_mode": "role",
  "id": "string",
  "assigned_by": "string",
  "allowed_member_ids": [
    "string"
  ]
}
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links
calls


POST
/api/v1/calls/orgs/{org_id}/calls
Create Call


Create a new call to an agent version within an organization.

Requires:

User is a member of the organization (any role)
Parameters
Cancel
Name	Description
org_id *
string($uuid)
(path)
org_id
Request body

application/json
{
  "input_payload": {
    "additionalProp1": {}
  },
  "agent_version_id": "string"
}
Execute
Responses
Code	Description	Links
201	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "id": "string",
  "agent_version_id": "string",
  "org_id": "string",
  "member_id": "string",
  "external_call_id": "string",
  "input_payload": {
    "additionalProp1": {}
  },
  "output_payload": {
    "additionalProp1": {}
  },
  "status": "string",
  "started_at": "2025-05-19T22:48:50.085Z",
  "finished_at": "2025-05-19T22:48:50.085Z"
}
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

GET
/api/v1/calls/orgs/{org_id}/calls
List Calls


List calls for an organization with optional filters.

Requires:

User is a member of the organization (any role)
Parameters
Cancel
Name	Description
org_id *
string($uuid)
(path)
org_id
agent_id
string | (string | null)($uuid)
(query)
agent_id
status
string | (string | null)
(query)
status
start_date
string | (string | null)($date)
(query)
start_date
end_date
string | (string | null)($date)
(query)
end_date
limit
integer
(query)
100
maximum: 1000
minimum: 1
offset
integer
(query)
0
minimum: 0
Execute
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
[
  {
    "id": "string",
    "agent_version_id": "string",
    "org_id": "string",
    "member_id": "string",
    "external_call_id": "string",
    "input_payload": {
      "additionalProp1": {}
    },
    "output_payload": {
      "additionalProp1": {}
    },
    "status": "string",
    "started_at": "2025-05-19T22:48:50.087Z",
    "finished_at": "2025-05-19T22:48:50.087Z"
  }
]
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

GET
/api/v1/calls/orgs/{org_id}/calls/{call_id}
Get Call


Get details of a specific call.

Requires:

User is a member of the organization (any role)
Parameters
Cancel
Name	Description
org_id *
string($uuid)
(path)
org_id
call_id *
string($uuid)
(path)
call_id
Execute
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "id": "string",
  "agent_version_id": "string",
  "org_id": "string",
  "member_id": "string",
  "external_call_id": "string",
  "input_payload": {
    "additionalProp1": {}
  },
  "output_payload": {
    "additionalProp1": {}
  },
  "status": "string",
  "started_at": "2025-05-19T22:48:50.089Z",
  "finished_at": "2025-05-19T22:48:50.089Z"
}
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

POST
/api/v1/calls/calls/{call_id}/callback
Callback Webhook

Webhook endpoint for third-party services to update call status and results.

This should be secured in production with an API key or signature verification.

Parameters
Cancel
Name	Description
call_id *
string($uuid)
(path)
call_id
Request body

application/json
{
  "external_call_id": "string",
  "output_payload": {
    "additionalProp1": {}
  },
  "status": "pending"
}
Execute
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
"string"
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links
restructure


POST
/api/v1/restructure/agents/{agent_id}/versions/{version_id}/restructure-requests
Create Restructure Request


Create a new restructure request for an agent version.

Requires:

Editor role in any organization
Parameters
Cancel
Name	Description
agent_id *
string($uuid)
(path)
agent_id
version_id *
string($uuid)
(path)
version_id
Request body

application/json
{
  "description": "string"
}
Execute
Responses
Code	Description	Links
201	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "description": "string",
  "id": "string",
  "agent_version_id": "string",
  "requested_by": "string",
  "status": "string",
  "resolved_by": "string",
  "created_at": "2025-05-19T22:48:50.092Z",
  "resolved_at": "2025-05-19T22:48:50.092Z"
}
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

GET
/api/v1/restructure/agents/{agent_id}/versions/{version_id}/restructure-requests
List Restructure Requests


List all restructure requests for an agent version.

Parameters
Cancel
Name	Description
agent_id *
string($uuid)
(path)
agent_id
version_id *
string($uuid)
(path)
version_id
Execute
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
[
  {
    "description": "string",
    "id": "string",
    "agent_version_id": "string",
    "requested_by": "string",
    "status": "string",
    "resolved_by": "string",
    "created_at": "2025-05-19T22:48:50.094Z",
    "resolved_at": "2025-05-19T22:48:50.094Z"
  }
]
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

PATCH
/api/v1/restructure/restructure-requests/{request_id}
Update Restructure Request


Update a restructure request status.

Requires:

Super admin role
Parameters
Cancel
Name	Description
request_id *
string($uuid)
(path)
request_id
Request body

application/json
{
  "status": "open"
}
Execute
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "description": "string",
  "id": "string",
  "agent_version_id": "string",
  "requested_by": "string",
  "status": "string",
  "resolved_by": "string",
  "created_at": "2025-05-19T22:48:50.096Z",
  "resolved_at": "2025-05-19T22:48:50.096Z"
}
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links
restructure-requests


POST
/api/v1/restructure/agents/{agent_id}/versions/{version_id}/restructure-requests
Create Restructure Request


Create a new restructure request for an agent version.

Requires:

Editor role in any organization
Parameters
Cancel
Name	Description
agent_id *
string($uuid)
(path)
agent_id
version_id *
string($uuid)
(path)
version_id
Request body

application/json
{
  "description": "string"
}
Execute
Responses
Code	Description	Links
201	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "description": "string",
  "id": "string",
  "agent_version_id": "string",
  "requested_by": "string",
  "status": "string",
  "resolved_by": "string",
  "created_at": "2025-05-19T22:48:50.099Z",
  "resolved_at": "2025-05-19T22:48:50.099Z"
}
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

GET
/api/v1/restructure/agents/{agent_id}/versions/{version_id}/restructure-requests
List Restructure Requests


List all restructure requests for an agent version.

Parameters
Cancel
Name	Description
agent_id *
string($uuid)
(path)
agent_id
version_id *
string($uuid)
(path)
version_id
Execute
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
[
  {
    "description": "string",
    "id": "string",
    "agent_version_id": "string",
    "requested_by": "string",
    "status": "string",
    "resolved_by": "string",
    "created_at": "2025-05-19T22:48:50.100Z",
    "resolved_at": "2025-05-19T22:48:50.100Z"
  }
]
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

PATCH
/api/v1/restructure/restructure-requests/{request_id}
Update Restructure Request


Update a restructure request status.

Requires:

Super admin role
Parameters
Cancel
Name	Description
request_id *
string($uuid)
(path)
request_id
Request body

application/json
{
  "status": "open"
}
Execute
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "description": "string",
  "id": "string",
  "agent_version_id": "string",
  "requested_by": "string",
  "status": "string",
  "resolved_by": "string",
  "created_at": "2025-05-19T22:48:50.102Z",
  "resolved_at": "2025-05-19T22:48:50.102Z"
}
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links
default


GET
/api/versions
List Versions

List all available API versions and their information.

Parameters
Cancel
No parameters

Execute
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
"string"
No links

GET
/health
Health Check

Health check endpoint.

Parameters
Cancel
No parameters

Execute
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
"string"
No links

Schemas
AgentCreateExpand allobject
AgentOrganizationCreateExpand allobject
AgentOrganizationResponseExpand allobject
AgentOrganizationUpdateExpand allobject
AgentResponseExpand allobject
AgentUpdateExpand allobject
AgentVersionCreateExpand allobject
AgentVersionResponseExpand allobject
AgentWithVersionsResponseExpand allobject
CallCreateExpand allobject
CallResponseExpand allobject
CallUpdateWebhookExpand allobject
HTTPValidationErrorExpand allobject
MemberWithRoleResponseExpand allobject
MembershipCreateExpand allobject
MembershipUpdateExpand allobject
OrganizationCreateExpand allobject
OrganizationResponseExpand allobject
OrganizationUpdateExpand allobject
RestructureRequestCreateExpand allobject
RestructureRequestResponseExpand allobject
RestructureRequestUpdateExpand allobject
UserResponseExpand allobject
ValidationErrorExpand allobject