"use client"; // client component

import React, { useState } from "react";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "../globals.css";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import dynamic from "next/dynamic";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Alert from "./Alert";

// Import Froala Text Editor plugins
import "froala-editor/js/plugins/align.min.js";
import "froala-editor/js/plugins/image.min.js";
import "froala-editor/js/plugins/video.min.js";
import "froala-editor/js/plugins/table.min.js";
import "froala-editor/js/plugins/colors.min.js";
import "froala-editor/js/plugins/lists.min.js";
import "froala-editor/js/plugins/paragraph_format.min.js";
import "froala-editor/js/plugins/paragraph_style.min.js";
import "froala-editor/js/plugins/line_height.min.js";
import "froala-editor/js/plugins/quote.min.js";
import "froala-editor/js/plugins/font_size.min.js";
import "froala-editor/js/plugins/font_family.min.js";
import "froala-editor/js/plugins/link.min.js";
import "froala-editor/js/plugins/file.min.js";
import "froala-editor/js/plugins/code_view.min.js";
import "froala-editor/js/plugins/emoticons.min.js";
import "froala-editor/js/plugins/word_paste.min.js";
import "froala-editor/js/plugins/fullscreen.min.js";
import "froala-editor/js/plugins/help.min.js";
import "froala-editor/js/plugins/print.min.js";

// Import Froala Text Editor
const FroalaEditor = dynamic(() => import("react-froala-wysiwyg"), {
  ssr: false,
});

function Add() {
  const [model, setModel] = useState(""); //text editor's content
  const [showAlert, setShowAlert] = useState(false); //alert displayed when sending data to firestore succesfully
  let imageUrl = "";
  let currentFile = null;
  let uploadedImages = [];

  // upload the image to firebase storage
  const uploadImageToFirebase = async (image) => {
    // If we use only the image name, uploading the same image twice will result in it being stored
    // only once in Firebase Storage. Deleting one instance would remove the image entirely.
    // To prevent this, we generate a unique file name by appending a timestamp to the image name.

    const uniqueImageName = `${Date.now()}_${image.name}`;
    const storageRef = ref(storage, `images/${uniqueImageName}`); // Use the unique name
    const snapshot = await uploadBytes(storageRef, image);
    const downloadURL = await getDownloadURL(snapshot.ref);
    uploadedImages.push(downloadURL); // Track uploaded image URLs
    return downloadURL;
  };
  // delete the image from firebase storage
  const deleteImageFromStorage = async (imagePath) => {
    const imageRef = ref(storage, imagePath); // Use the image path
    try {
      await deleteObject(imageRef); // Delete the image with the chose path
      console.log("image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // Froala Editor configuration
  const editorConfig = {
    toolbarButtons: [
      "bold",
      "italic",
      "underline",
      "strikeThrough",
      "|",
      "fontFamily",
      "fontSize",
      "textColor",
      "backgroundColor",
      "|",
      "align",
      "formatOL",
      "formatUL",
      "outdent",
      "indent",
      "|",
      "insertLink",
      "insertImage",
      "insertVideo",
      "insertFile",
      "|",
      "insertTable",
      "insertHR",
      "quote",
      "emoticons",
      "insertHTML",
      "|",
      "clearFormatting",
      "undo",
      "redo",
      "fullscreen",
      "print",
      "help",
      "|",
      "html",
      "paragraphFormat",
      "paragraphStyle",
      "lineHeight",
      "subscript",
      "superscript",
      "codeView",
    ],
    pluginsEnabled: [
      "align",
      "image",
      "video",
      "table",
      "lists",
      "colors",
      "fontSize",
      "fontFamily",
      "paragraphFormat",
      "paragraphStyle",
      "lineHeight",
      "quote",
      "link",
      "file",
      "codeView",
      "emoticons",
      "wordPaste",
      "fullscreen",
      "help",
      "print",
      "insertHTML",
    ],
    imageUpload: true,

    events: {
      "image.beforeUpload": function (files) {
        currentFile = files[0]; // Store the image to be uploaded to Firebase

        // Upload the image to Firebase
        uploadImageToFirebase(currentFile)
          .then((imageUrl) => {
            //insert the image with the Firebase url
            this.image.insert(imageUrl, true, null, this.image.get(), null);
            console.log("Firebase image URL inserted:", imageUrl);
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });

        return false; // Prevent Froala from inserting the local image which wasn't uploaded yet to storage
      },

      // Handle image removal
      "image.beforeRemove": async function (img) {
        const imageUrl = img[0].src; // Get the image URL
        const imagePath = imageUrl.split("images%2F")[1].split("?")[0]; // Extract the image path from the URL
        if (imagePath) {
          await deleteImageFromStorage(
            `images/${decodeURIComponent(imagePath)}`
          );
          console.log("Image removed from Firebase:", imageUrl);
        }
      },
    },
  };

  // add data to Firestore
  const addDataWithId = async () => {
    try {
      let html_code = model;

      // Add document to Firestore
      const docRef = await addDoc(collection(db, "products"), {
        html: html_code,
      });

      console.log("Document written with ID: ", docRef.id);
      setShowAlert(true); //show alert of succesfull sending

      // Hide the alert after 3 seconds
      setTimeout(() => setShowAlert(false), 3000);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="App">
      {showAlert && (
        <>
          <div className="overlay show"></div> {/* Overlay */}
          <Alert /> {/* Alert Box */}
        </>
      )}
      <div className="editorContainer">
        <h3>Create details for your product</h3>
        <FroalaEditor
          model={model}
          onModelChange={setModel}
          config={editorConfig}
        />
        <button
          onClick={() => {
            addDataWithId();
            setModel(""); //to create a new product clean the content of the text editor
          }}
          className="add"
        >
          Add details
        </button>
        {showAlert && <Alert />} {/* Show alert if showAlert is true */}
      </div>
    </div>
  );
}

export default Add;
