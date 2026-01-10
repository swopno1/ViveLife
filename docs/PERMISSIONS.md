# ViveLife Permission Model

This document defines the roles and permissions for users within a family. The model is designed to be simple for the MVP, with three distinct roles: Owner, Editor, and Viewer.

## Roles

### 1. Owner
- The user who creates the family.
- There can only be one owner per family.
- Has full control over the family and its data.

### 2. Editor
- A family member with broad permissions to manage day-to-day data.
- Can be invited by the Owner or another Editor.

### 3. Viewer
- A family member with read-only access.
- Useful for family members who need to stay informed but not manage data (e.g., older children).
- Can be invited by the Owner or an Editor.

## Permission Matrix

| Action                               | Owner | Editor | Viewer | Notes                               |
| ------------------------------------ | :---: | :----: | :----: | ----------------------------------- |
| **Family Management**                |       |        |        |                                     |
| Rename Family                        |  ✅   |   ❌   |   ❌   |                                     |
| Invite Members                       |  ✅   |   ✅   |   ❌   |                                     |
| Change Member Roles                  |  ✅   |   ✅   |   ❌   | Cannot change the Owner's role.     |
| Remove Members                       |  ✅   |   ✅   |   ❌   | Cannot remove the Owner.            |
| Delete Family                        |  ✅   |   ❌   |   ❌   |                                     |
|                                      |       |        |        |                                     |
| **Financials (Transactions, Budgets, Goals)** |       |        |        |                                     |
| Create, Update, Delete Transactions  |  ✅   |   ✅   |   ❌   |                                     |
| View Financial Data                  |  ✅   |   ✅   |   ✅   |                                     |
| Create, Update, Delete Categories    |  ✅   |   ✅   |   ❌   |                                     |
| Create, Update, Delete Savings Goals |  ✅   |   ✅   |   ❌   |                                     |
|                                      |       |        |        |                                     |
| **Lists (To-Do & Shopping)**         |       |        |        |                                     |
| Create Shared Lists                  |  ✅   |   ✅   |   ❌   |                                     |
| Add/Edit/Complete Items (Shared)     |  ✅   |   ✅   |   ✅   | Viewers can check off items.        |
| Delete Shared Lists                  |  ✅   |   ✅   |   ❌   |                                     |
| View Shared Lists                    |  ✅   |   ✅   |   ✅   |                                     |
|                                      |       |        |        |                                     |
| **Personal Data (Own Notes & Lists)**    | User (Self) | Other Members | Notes                               |
| ------------------------------------ | :---------: | :-----------: | ----------------------------------- |
| Create, View, Edit, Delete           |      ✅     |      ❌       | Strictly private to each user.      |
