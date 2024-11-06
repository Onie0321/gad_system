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
    responseCollectionId: process.env.NEXT_PUBLIC_APPWRITE_RESPONSES_COLLECTION_ID,
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const account = new Account(client);
//const avatars = new Avatars(client);
export const databases = new Databases(client);

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

// Create Event
export async function createEvent(eventData) {
  try {
    const newEvent = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.eventCollectionId,
      ID.unique(),
      {
        eventName: eventData.eventName,
        eventDate: eventData.eventDate,
        eventTimeFrom: eventData.eventTimeFrom,
        eventTimeTo: eventData.eventTimeTo,
        eventVenue: eventData.eventVenue,
        eventType: eventData.eventType,
        eventCategory: eventData.eventCategory,
        numberOfHours: eventData.numberOfHours,
        participants: [], // Initialize with an empty participants array
      }
    );

    return newEvent; // Return the entire new event object
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error(`Error creating event: ${error.message}`);
  }
}

export async function checkDuplicateEvent(eventData) {
  const { eventName } = eventData;

  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.eventCollectionId,
      [Query.equal("eventName", eventName)]
    );

    return response.total > 0;
  } catch (error) {
    console.error("Error checking for duplicate event:", error);
    throw new Error(`Error checking for duplicate event: ${error.message}`);
  }
}

// Fetch Events
export async function fetchEvents() {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.eventCollectionId
    );

    if (!response.documents || response.documents.length === 0) {
      throw new Error("No events found");
    }

    return response.documents; // Return the array of event documents
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error(`Error fetching events: ${error.message}`);
  }
}

export async function addParticipantToEvent(eventId, participantData) {
  if (!eventId) {
    throw new Error("EventId is required to add a participant");
  }

  try {
    // Log participant data and eventId for debugging
    console.log("Participant Data:", participantData);
    console.log("EventId:", eventId);

    // Create the participant document in the participants collection
    const newParticipant = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.participantCollectionId,
      ID.unique(), // Generate a unique document ID
      {
        name: participantData.name,
        sex: participantData.sex,
        age: parseInt(participantData.age), // Ensure age is an integer
        school: participantData.school, // Ensure this matches your Appwrite field
        year: participantData.year,
        section: participantData.section,
        ethnicGroup: participantData.ethnicGroup,
        otherEthnicGroup: participantData.otherEthnicGroup || "", // Handle optional field
        eventId: eventId, // Associate participant with the event
      }
    );

    console.log("New participant added:", newParticipant);

    // Fetch the event document to get its current participants array
    const eventDocument = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.eventCollectionId,
      eventId
    );

    console.log("Fetched event document:", eventDocument);

    // Update the event's participants array (make sure participants is an array field in the event collection)
    const updatedParticipants = [
      ...(eventDocument.participants || []),
      newParticipant.$id,
    ];

    // Update the event document with the new participants array
    const updatedEvent = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.eventCollectionId,
      eventId,
      { participants: updatedParticipants }
    );

    console.log("Updated event with new participants:", updatedEvent);

    return updatedEvent; // Return the updated event document
  } catch (error) {
    console.error("Error adding participant to event:", error);
    throw new Error(`Error adding participant to event: ${error.message}`);
  }
}

export async function fetchParticipants(eventId) {
  if (!eventId) {
    throw new Error("EventId is required to fetch participants");
  }

  try {
    const eventDocument = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.eventCollectionId,
      eventId
    );

    if (!eventDocument.participants || eventDocument.participants.length === 0) {
      return []; // No participants found
    }

    const participants = [];
    // Fetch each participant by their ID
    for (const participantId of eventDocument.participants) {
      const participant = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.participantCollectionId,
        participantId
      );
      participants.push(participant);
    }

    console.log("Fetched Participants:", participants); // Log the participant data for debugging
    return participants;
  } catch (error) {
    console.error("Error fetching participants:", error);
    throw new Error(`Error fetching participants: ${error.message}`);
  }
}

export const uploadDataToAppwrite = async (excelData) => {
  const responseCollectionId = appwriteConfig.responseCollectionId;
const databaseId = appwriteConfig.databaseId;

  try {
    for (const row of excelData) {
      await databases.createDocument(databaseId, responseCollectionId, "unique()", row);
    }
    console.log("Data uploaded successfully!");
  } catch (error) {
    console.error("Error uploading data:", error);
  }
};

export async function checkIfParticipantExists(eventId, name) {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.participantCollectionId,
      [
        Query.equal("name", name),
        Query.equal("eventId", eventId), // Check within the same event
      ]
    );

    return response.documents.length > 0; // Return true if a participant already exists
  } catch (error) {
    console.error("Error checking if participant exists:", error);
    throw new Error("Error checking if participant exists");
  }
}

