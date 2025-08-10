// src/types.ts

export interface User {
  id: string; // This will be the Firebase User ID (uid)
  name: string; // Corresponds to Firebase displayName
  email: string;
  phone: string; // Custom field, will likely be empty or default unless fetched from Firestore
  role: 'citizen' | 'admin' | 'moderator' | string; // Custom field
  county: string; // Custom field
  constituency: string; // Custom field
  ward: string; // Custom field
  createdAt: string; // ISO string date, from Firebase metadata
  // Add other properties you might derive or store
  // emailVerified?: boolean; // You might want this on your User type too
}
