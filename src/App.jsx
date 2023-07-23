import { useEffect, useState } from "react";
import { Auth } from "./components/auth";
import { db, auth, storage} from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [movieList, setMovieList] = useState([]);

  // New movies states...
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isReceivedHeart, setIsReceivedHeart] = useState(true);

  // Update releaseDate states
  const [updateReleaseDate, setUpdateReleaseDate] = useState(0);

  const [fileUpload, setFileUpload] = useState(null);

  const moviesCollectionRef = collection(db, "movies");

  useEffect(() => {
    getMovieList();
  }, []);

  // READ DATA FROM THE DATABASE
  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  // ADD DATA TO THE DATABASE
  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedHeart: isReceivedHeart,
        userId: auth?.currentUser?.uid,
      });

      getMovieList(); // update the movie list after submitting the new movie list.

      // set the input field again to empty for the next time
      setNewMovieTitle("");
      setNewReleaseDate(0);
    } catch (error) {
      console.error(error);
    }
  };

  // DELETE THE DATA FROM THE DATABASE
  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    getMovieList(); // update the movie list after deletion
  };

  // UPDATE THE RELEASE DATE
  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { releaseDate: updateReleaseDate });
    getMovieList(); // update the movie list after deletion
  };

  const uploadFile = async () => {
    if(!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try{
      await uploadBytes(filesFolderRef, fileUpload)
    } catch(error) {
      console.error(error)
    }
  }

  return (
    <div className="app">
      <Auth />

      <div>
        <input
          type="text"
          value={newMovieTitle}
          placeholder="movie title..."
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          type="number"
          value={newReleaseDate}
          placeholder="release data..."
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
        />
        <input
          type="checkbox"
          checked={isReceivedHeart}
          onChange={(e) => setIsReceivedHeart(e.target.checked)}
        />
        <label>Received millions of heart</label>
        <button type="submit" onClick={onSubmitMovie}>
          Submit
        </button>
      </div>

      <div className="movie">
        {movieList.map((movie) => (
          <div key={movie.id}>
            <h1
              style={{
                color: movie.receivedHeart ? "green" : "red",
              }}
            >
              {movie.title.name}
            </h1>
            <p>Date: {movie.releaseDate} </p>

            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>

            <input
              type="text"
              placeholder="update the release date..."
              onChange={(e) => setUpdateReleaseDate(e.target.value)}
            />
            <button onClick={() => updateMovieTitle(movie.id)}>
              Update Release Date
            </button>
          </div>
        ))}
      </div>

      <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
      <button onClick={uploadFile}>Upload file</button>
    </div>
  );
}

export default App;
