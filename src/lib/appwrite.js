import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Realtime,
  Storage,
  Permission, Role,
} from "appwrite";

export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
  userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID,
  eventCollectionId: process.env.NEXT_PUBLIC_APPWRITE_EVENT_COLLECTION_ID,
  participantCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_PARTICIPANT_COLLECTION_ID,
  responseCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_RESPONSES_COLLECTION_ID,
  employeesCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_EMPLOYEES_COLLECTION_ID,
    exceluploadsCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_EXCELUPLOADS_COLLECTION_ID,
    newsCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_NEWS_COLLECTION_ID,
    messagesCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID,
    archivesCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_ARCHIVES_COLLECTION_ID,
    servicesCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_SERVICES_COLLECTION_ID,

};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const account = new Account(client);
//const avatars = new Avatars(client);
export const databases = new Databases(client);
const storage = new Storage(client);

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

export async function updateUser(userId, updatedData) {
  try {
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId, // Removed .`$id` since userId should be a string
      updatedData
    );
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to update user.");
  }
}


// Function to delete a user
export async function deleteUser(userId) {
  try {
    await databases.deleteDocument( appwriteConfig.databaseId,
      appwriteConfig.userCollectionId, userId.$id);
  } catch (error) {
    throw new Error(error.message || "Failed to delete user.");
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

export async function getAllUsersFromAuth() {
  try {
    console.log("Fetching users from Appwrite Auth...");

    const response = await usersApi.list(); // Fetch users using the Users API
    console.log("Users fetched successfully from Auth:", response.users);
    return response.users || []; // Return the users array
  } catch (error) {
    console.error("Error fetching users from Appwrite Auth:", error);
    throw new Error(error.message || "Failed to fetch users from Auth.");
  }
}

export async function saveContactMessage({ name, email, message }) {
  try {
    // Validate input
    if (!name || !email || !message) {
      throw new Error("All fields (name, email, message) are required.");
    }

    // Create the document in the messages collection
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      ID.unique(),
      { name, email, message },
      [
        Permission.read(Role.any()), // Allow public read access (adjust if needed)
        Permission.create(Role.member()), // Allow members to create
      ]
    );

    return response;
  } catch (error) {
    console.error("Error saving message:", error.message);
    throw new Error("Failed to save message: " + error.message);
  }
}

// Function to fetch latest news
export async function getLatestNews() {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.newsCollectionId,
      ID.unique(),
    );
    return response.documents;
  } catch (error) {
    throw new Error("Failed to fetch news: " + error.message);
  }
}

// Function to get services
export async function getServices() {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.servicesCollectionId,
      ID.unique(),
    );
    return response.documents;
  } catch (error) {
    throw new Error("Failed to fetch services: " + error.message);
  }
}

// Function to get archive items
export async function getArchiveItems() {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.archivesCollectionId,
      ID.unique(),
    );
    return response.documents;
  } catch (error) {
    throw new Error("Failed to fetch archive items: " + error.message);
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

export async function editEvent(eventId, updatedEventData) {
  try {
    const updatedEvent = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.eventCollectionId,
      eventId,
      {
        eventName: updatedEventData.eventName,
        eventDate: updatedEventData.eventDate,
        eventTimeFrom: updatedEventData.eventTimeFrom,
        eventTimeTo: updatedEventData.eventTimeTo,
        eventVenue: updatedEventData.eventVenue,
        eventType: updatedEventData.eventType,
        eventCategory: updatedEventData.eventCategory,
        numberOfHours: updatedEventData.numberOfHours,
        participants: updatedEventData.participants || [], // Keeps participants as provided
      }
    );

    return updatedEvent; // Return the updated event object
  } catch (error) {
    console.error("Error updating event:", error);
    throw new Error(`Error updating event: ${error.message}`);
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

    let existingParticipant = await getParticipantByStudentId(participantData.studentId);

    // If the participant does not exist, create a new document in the participants collection
    if (!existingParticipant) {
      existingParticipant = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.participantCollectionId,
        ID.unique(),
      {
        studentId: participantData.studentId,
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
    console.log("New participant added:", existingParticipant);
  } else {
    console.log("Existing participant found:", existingParticipant);
  }

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
    existingParticipant.$id, // Add the participant's ID, either new or existing
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
    // Fetch the event document first
    const eventDocument = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.eventCollectionId,
      eventId
    );

    if (
      !eventDocument.participants ||
      eventDocument.participants.length === 0
    ) {
      return []; // Return an empty array if no participants found
    }

    const participants = [];
    for (const participantId of eventDocument.participants) {
      try {
        // Attempt to fetch each participant by ID
        const participant = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.participantCollectionId,
          participantId
        );
        participants.push(participant);
      } catch (error) {
        console.warn(
          `Participant with ID ${participantId} not found and skipped.`
        );
        continue; // Skip this participant if the document is not found
      }
    }

    console.log("Fetched Participants:", participants);
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
      await databases.createDocument(
        databaseId,
        responseCollectionId,
        "unique()",
        row
      );
    }
    console.log("Data uploaded successfully!");
  } catch (error) {
    console.error("Error uploading data:", error);
  }
};

export async function checkIfParticipantExists(eventId, studentId, name) {
  try {
    console.log("Checking if participant exists with:", {
      eventId,
      studentId,
      name,
    }); // Log inputs

    // Check only for eventId and studentId first
    const responseByStudentId = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.participantCollectionId,
      [Query.equal("eventId", eventId), Query.equal("studentId", studentId)]
    );

    if (responseByStudentId.documents.length > 0) {
      console.log("Duplicate Student ID found.");
      return true;
    }

    // Check only for eventId and name next
    const responseByName = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.participantCollectionId,
      [Query.equal("eventId", eventId), Query.equal("name", name)]
    );

    if (responseByName.documents.length > 0) {
      console.log("Duplicate Name found.");
      return true;
    }

    // No duplicates found
    return false;
  } catch (error) {
    console.error("Detailed error checking if participant exists:", error);
    throw new Error("Error checking if participant exists");
  }
}

// In appwrite.js or your Appwrite utilities file
export async function getParticipantByStudentId(studentId) {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.participantCollectionId,
      [Query.equal("studentId", studentId)]
    );

    if (response.documents.length > 0) {
      return response.documents[0]; // Return the first matching document
    } else {
      return null; // Return null if no participant is found
    }
  } catch (error) {
    console.error("Error fetching participant by studentId:", error);
    throw new Error("Error fetching participant by studentId");
  }
}


export async function checkDocumentExists(documentId) {
  try {
    const document = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.participantCollectionId, // Your collection ID
      documentId
    );
    return document;
  } catch (error) {
    if (error.response?.status === 404) {
      console.error("Document not found.");
    } else {
      console.error("Error fetching document:", error);
    }
    return null;
  }
}

// Fetch all events from the Appwrite database
export async function fetchAllEvents() {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.eventCollectionId
    );
    return response.documents; // Return the array of event documents
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Error fetching events");
  }
}

// Fetch all participants from the Appwrite database
export async function fetchAllParticipants() {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.participantCollectionId
    );
    return response.documents; // Return the array of participant documents
  } catch (error) {
    console.error("Error fetching participants:", error);
    throw new Error("Error fetching participants");
  }
}

// Function to upload an Excel file to Appwrite storage
export async function uploadExcelFile(file) {
  try {
    // Upload the file to the specified bucket
    const response = await storage.createFile(
      appwriteConfig.exceluploadsCollectionId, // Your bucket ID for exceluploads
      ID.unique(), // Generate a unique ID for the file
      file // The file object to upload
    );

    console.log('File uploaded successfully:', response);
    return response; // Return the response for further use
  } catch (error) {
    console.error("Error uploading file to Appwrite:", error); // Log full error details
    setError(error.message || "Failed to upload the file to Appwrite storage.");
  }
  
}

