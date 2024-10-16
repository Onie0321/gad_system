import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "appwrite";

export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
  userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID,
  eventCollectionId: process.env.NEXT_PUBLIC_APPWRITE_EVENT_COLLECTION_ID,
  participantCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_PARTICIPANT_COLLECTION_ID,
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const account = new Account(client);
//const avatars = new Avatars(client);
const databases = new Databases(client);

export async function createUser(email, password, name, role = "admin") {
  try {
    // Create the new account
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw new Error("Account creation failed.");

    // Generate an avatar URL for the user
    //  const avatarUrl = avatars.getInitials(username);

    // Create the user document in the database with the role field
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        name: name,
        // avatar: avatarUrl,
        role: role, // Set role to 'admin' or 'user' as needed
      }
    );

    // Sign in the new user
    const session = await account.createEmailPasswordSession(email, password);
    if (session) {
      // Return the newUser object with the role property
      return newUser; // Return the user object if successful
    } else {
      throw new Error("Failed to create session.");
    }
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw new Error("Error creating user");
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    // Create a new email session
    const session = await account.createEmailPasswordSession(email, password);
    if (session) {
      // Ensure the user has the account scope
      const currentAccount = await account.get();
      if (!currentAccount) throw new Error("Unable to retrieve account.");
      return currentAccount; // Return the account if successful
    } else {
      throw new Error("Failed to create session.");
    }
  } catch (error) {
    console.error("Error signing in:", error.message);
    throw new Error(error.message || "Error signing in");
  }
}

export async function getAccount() {
  try {
    console.log("Fetching current account...");
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    if (
      error.message.includes("Missing scope") ||
      error.message.includes("unauthorized")
    ) {
      console.warn(
        "User is not authenticated. Redirect to login or handle session."
      );
      // Redirect to login page or handle session
      return null;
    } else {
      throw new Error(error.message || "Error fetching account");
    }
  }
}

export async function getCurrentUser() {
  try {
    // Ensure the user is authenticated before fetching account info
    const currentAccount = await getAccount();
    if (!currentAccount || !currentAccount.$id) {
      throw new Error("No account found.");
    }

    // Query for the user document using the accountId
    const currentUserResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)] // Ensure 'accountId' is the correct field name
    );

    if (!currentUserResponse || currentUserResponse.total === 0) {
      throw new Error("No user document found.");
    }

    const userDocument = currentUserResponse.documents[0]; // Get the user document

    // Check if the role field exists in the document
    if (!userDocument.role) {
      // If the role field is missing, assign a default role (e.g., 'user')
      userDocument.role = "user";
    }

    return userDocument; // Return the user document which includes role
  } catch {
    // Improved error logging
    return null; // Return null if there's an error
  }
}

// Get all users
export async function getAllUsers() {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId
    );
    return response.documents; // Adjust based on your actual data structure
  } catch (error) {
    throw new Error("Error fetching users");
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.error("Error signing out:", error.message);
    throw new Error(error);
  }
}

import React from "react";

export async function createEvent(eventData) {
  const {
    eventName,
    eventDate,
    eventTimeFrom,
    eventTimeTo,
    eventVenue,
    eventType,
    eventCategory,
    numberOfHours,
  } = eventData;

  try {
    const newEvent = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.eventCollectionId,
      ID.unique(),
      {
        eventName, // Changed to eventName
        eventDate, // Date object
        eventTimeFrom, // Date object
        eventTimeTo, // Date object
        eventVenue, // String
        eventType, // String
        eventCategory, // String
        numberOfHours, // Integer (number in JS)
      }
    );

    console.log("Event created successfully:", newEvent);
    return newEvent;
  } catch (error) {
    console.error("Detailed error in createEvent:", error);
    throw new Error(`Error creating event: ${error.message}`);
  }
}

// Add Participant to Event
export async function addParticipantToEvent(eventId, participantData) {
  try {
    const {
      name,
      sex,
      age,
      department,
      year,
      section,
      ethnicGroup,
      otherEthnicGroup,
    } = participantData;

    const newParticipant = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.participantCollectionId,
      ID.unique(),
      {
        name,
        sex,
        age,
        department,
        year,
        section,
        ethnicGroup,
        otherEthnicGroup,
        eventId, // Store the eventId to link this participant to the event
      }
    );

    return newParticipant; // Return the created participant document
  } catch (error) {
    console.error("Error adding participant to event:", error.message);
    throw new Error("Error adding participant to event");
  }
}
