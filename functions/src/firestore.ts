import {getFirestore, doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import * as dotenv from "dotenv";

// uses the projectID to retrieve the db
export function initializeAppWithProjectId() {
  dotenv.config();

  const projectId = process.env.PROJECT_ID;

  const firebaseApp = initializeApp({
    projectId: projectId,
  });
  const db = getFirestore(firebaseApp);
  return db;
}

// given the db, sessionId (which is used as a key for the firestore document id), and offer
// create a new document if the given sessionId is nonexistant
// modify the current document by adding the offer if sessionId already exists
export async function addOffer(db: any, sessionId: string, offer: number[]) {
  const docRef = doc(db, "sessions", sessionId);
  const docSnap = await getDoc(docRef);

  // non-existing document
  if (!docSnap.exists()) {
    const offers = offer;
    const data = {name: "", offers: offers};

    try {
      await setDoc(doc(db, "sessions", sessionId), data);
    } catch (err) {
      console.log('Sorry, there was an issue with your account. Please try again later.');
    }
  } else { // existing document
    const offers = docSnap.data().offers;
    offer.forEach((o) => {
      offers.push(o);
    });

    await updateDoc(docRef, {
      offers: offers,
    });
  }
}

// generateOffer() should always called after addOffer()
// return the average value of offers
export async function generateOffer(db: any, sessionId: string) {
  const docRef = doc(db, "sessions", sessionId);
  const docSnap = await getDoc(docRef);
  let sum = 0;
  console.log("outside exist");
  if (docSnap.exists()) {
    console.log("inside exist");
    const offers = docSnap.data().offers;
    offers.forEach((o : number) => {
      sum += o;
    });
    // drops the decimal value
    return (sum / offers.length).toFixed();
  }
  return 0;
}

// similar to addOffer(), but for name
export async function saveName(db: any, sessionId: string, name: string) {
  const docRef = doc(db, "sessions", sessionId);
  const docSnap = await getDoc(docRef);

  // non-existing document
  if (!docSnap.exists()) {
    const data = {name: name, offers: []};

    try {
      await setDoc(doc(db, "sessions", sessionId), data);
    } catch (err) {
      console.log('Sorry, there was an issue with your account. Please try again later.');
    }
  } else {
    await updateDoc(docRef, {
      name: name,
    });
  }
}

// returns the saved name value within the sessionId document
export async function getName(db: any, sessionId: string) {
  const docRef = doc(db, "sessions", sessionId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    const data = {name: "", offers: []};
    try {
      await setDoc(doc(db, "sessions", sessionId), data);
    } catch (err) {
      console.log('Sorry, there was an issue with your account. Please try again later.');
    }
    return "";
  } else {
    const name = docSnap.data().name;
    return name;
  }
}
