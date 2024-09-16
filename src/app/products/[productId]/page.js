"use client"; //client component

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import firebaseApp from "../../Firebase"; //
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "../../globals.css";
import { ClipLoader } from "react-spinners"; //react spinner for loading

// Initialize Firestore
const db = getFirestore(firebaseApp);

const ProductDetails = ({ params }) => {
  const productId = params.productId;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const docRef = doc(db, "products", productId); // Reference to the specific document of the production collection
        const docSnap = await getDoc(docRef); // Fetch the document

        if (docSnap.exists()) {
          console.log(docSnap.data());
          setProduct(docSnap.data()); // Set the product state with the document data
        } else {
          console.error("No such document!");
        }
      } catch (erreur) {
        console.error("the fetching didn't work", erreur);
      }
    };

    fetchProductDetails(); // Call the async function to fetch data
  }, [productId]);

  if (!product)
    //if product is still null (the fetching is not done yet) display the react spinner for loading display
    return (
      <div className="spinner-container">
        <ClipLoader
          size={60}
          color="#ff6347"
          cssOverride={{
            borderWidth: "8px",
            marginBottom: "12px",
          }}
        />
        <p>...Loading</p>
      </div>
    );

  return (
    <div className="fr-view">
      {/* we used this classname to keep the styling which was used inside the text editor textarea that has this same classname */}
      <h1>Details</h1>
      <div dangerouslySetInnerHTML={{ __html: product.html }} id="details" /> {/*Render HTML content from the `product.html` string into the `div` element.*/}
    </div>
  );
};

export default ProductDetails;
