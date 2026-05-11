# API Quick Reference

## Base URL
```
http://localhost:8081/api
```

## Departments API
```
GET    /departements                    - List all departments
POST   /departements                    - Create department
GET    /departements/{id}               - Get department by ID
GET    /departements/by-name/{nom}     - Get department by name
PUT    /departements/{id}               - Update department
DELETE /departements/{id}               - Delete department
```

## Students API
```
GET    /etudiants                       - List all students
POST   /etudiants                       - Create student
GET    /etudiants/{id}                  - Get student by ID
GET    /etudiants/by-email/{email}     - Get student by email
GET    /etudiants/departement/{dept}   - List students in department
PUT    /etudiants/{id}                  - Update student
DELETE /etudiants/{id}                  - Delete student
```

## Instructors API
```
GET    /enseignants                     - List all instructors
POST   /enseignants                     - Create instructor
GET    /enseignants/{id}                - Get instructor by ID
GET    /enseignants/by-email/{email}   - Get instructor by email
GET    /enseignants/departement/{dept} - List instructors in department
PUT    /enseignants/{id}                - Update instructor
DELETE /enseignants/{id}                - Delete instructor
```

## Admins API
```
GET    /admins                          - List all admins
POST   /admins                          - Create admin
GET    /admins/{id}                     - Get admin by ID
GET    /admins/by-email/{email}        - Get admin by email
PUT    /admins/{id}                     - Update admin
DELETE /admins/{id}                     - Delete admin
```

## Courses API
```
GET    /cours                           - List all courses
POST   /cours                           - Create course
GET    /cours/{id}                      - Get course by ID
GET    /cours/departement/{id}         - List courses in department
GET    /cours/enseignant/{id}          - List instructor's courses
PUT    /cours/{id}                      - Update course
DELETE /cours/{id}                      - Delete course
```

## Absences API
```
GET    /absences                        - List all absences
POST   /absences                        - Record absence
GET    /absences/{id}                   - Get absence by ID
GET    /absences/etudiant/{id}         - List student's absences
GET    /absences/cours/{id}            - List absences in course
PUT    /absences/{id}                   - Update absence
DELETE /absences/{id}                   - Delete absence
```

## Schedule API
```
GET    /emploi-du-temps                 - List all schedule entries
POST   /emploi-du-temps                 - Create schedule entry
GET    /emploi-du-temps/{id}            - Get schedule entry by ID
GET    /emploi-du-temps/cours/{id}     - List schedule for course
PUT    /emploi-du-temps/{id}            - Update schedule entry
DELETE /emploi-du-temps/{id}            - Delete schedule entry
```

## Projects API
```
GET    /projets                         - List all projects
POST   /projets                         - Create project
GET    /projets/{id}                    - Get project by ID
GET    /projets/enseignant/{id}        - List instructor's projects
PUT    /projets/{id}                    - Update project
DELETE /projets/{id}                    - Delete project
```

## Requests API
```
GET    /demandes                        - List all requests
POST   /demandes                        - Submit request
GET    /demandes/{id}                   - Get request by ID
GET    /demandes/etudiant/{id}         - List student's requests
GET    /demandes/admin/{id}            - List admin's requests
PUT    /demandes/{id}                   - Update request
DELETE /demandes/{id}                   - Delete request
```

## Notifications API
```
GET    /notifications                   - List all notifications
POST   /notifications                   - Create notification
GET    /notifications/{id}              - Get notification by ID
GET    /notifications/user/{id}        - List user's notifications
GET    /notifications/user/{id}/unread - List unread notifications
PUT    /notifications/{id}/read         - Mark as read
PUT    /notifications/{id}              - Update notification
DELETE /notifications/{id}              - Delete notification
```

## Users API
```
GET    /users                           - List all users
GET    /users/{id}                      - Get user by ID
GET    /users/email/{email}            - Get user by email
GET    /users/active                    - List active users
PUT    /users/{id}                      - Update user
PUT    /users/{id}/activate             - Activate user
PUT    /users/{id}/deactivate          - Deactivate user
DELETE /users/{id}                      - Delete user
```

## HTTP Status Codes
```
200 OK              - Request successful
201 Created         - Resource created
204 No Content      - Operation successful, no response body
400 Bad Request     - Invalid request parameters
404 Not Found       - Resource not found
500 Server Error    - Internal server error
```

## Example Requests

### Create a Student
```bash
curl -X POST http://localhost:8081/api/etudiants \
  -H "Content-Type: application/json" \
  -d '{
    "email": "new.student@education.com",
    "password": "secure123",
    "firstName": "Jean",
    "lastName": "Dubois",
    "phoneNumber": "+33612345678",
    "address": "123 Rue de Rivoli",
    "niveau": "L2",
    "groupe": "Groupe A",
    "departement": {"id": 1}
  }'
```

### Get All Courses
```bash
curl http://localhost:8081/api/cours
```

### Record an Absence
```bash
curl -X POST http://localhost:8081/api/absences \
  -H "Content-Type: application/json" \
  -d '{
    "dateAbsence": "2026-01-07T10:00:00",
    "statut": "NON_JUSTIFIEE",
    "etudiant": {"id": 4},
    "cours": {"id": 1},
    "enseignant": {"id": 2}
  }'
```

### Create a Schedule Entry
```bash
curl -X POST http://localhost:8081/api/emploi-du-temps \
  -H "Content-Type: application/json" \
  -d '{
    "jour": "Monday",
    "heureDebut": "09:00",
    "heureFin": "11:00",
    "salle": "A101",
    "cours": {"id": 1}
  }'
```

### Submit a Request
```bash
curl -X POST http://localhost:8081/api/demandes \
  -H "Content-Type: application/json" \
  -d '{
    "type": "STAGE",
    "dateDemande": "2026-01-07T14:00:00",
    "statut": "EN_ATTENTE",
    "urgent": false,
    "description": "Internship request for web development",
    "etudiant": {"id": 4},
    "admin": {"id": 1}
  }'
```

### Send a Notification
```bash
curl -X POST http://localhost:8081/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Your assignment has been graded",
    "dateNotification": "2026-01-07T15:00:00",
    "lu": false,
    "user": {"id": 4}
  }'
```

## CORS Settings
- **Allowed Origins:** *
- **Max Age:** 3600 seconds
- **Methods:** GET, POST, PUT, DELETE, OPTIONS
- **Headers:** Content-Type, Authorization

## Data Validation
- Email uniqueness: Enforced at database level
- Required fields: Validated by Hibernate/JPA
- Type safety: Enums for Status and Type fields
- Timestamps: Auto-managed (createdAt, updatedAt)

## Response Format
```json
{
  "id": 1,
  "email": "user@education.com",
  "firstName": "Jean",
  "lastName": "Dupont",
  "phoneNumber": "+33612345678",
  "address": "123 Rue",
  "isActive": true,
  "createdAt": "2026-01-07T14:52:24.58132",
  "updatedAt": "2026-01-07T14:52:24.58132"
}
```

---
*API Documentation - Education Backend v1.0.0*
