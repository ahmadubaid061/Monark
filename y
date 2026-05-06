rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products collection - anyone can read, only admin can write
    match /products/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Orders collection - anyone can CREATE (place order), only admin can read/update/delete
    match /orders/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // Contacts collection - anyone can CREATE (send message), only admin can read/update/delete
    match /contacts/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // Users collection (future)
    match /users/{document} {
      allow read, write: if request.auth != null;
    }
  }
}