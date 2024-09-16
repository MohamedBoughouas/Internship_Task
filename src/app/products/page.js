"use client"; // client component

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import "../globals.css";
import { db } from "../firebase"; // Import your Firebase config
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners"; //react spinner for loading

function Products() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  let counter = 0; //to count products

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsArray);
      setLoading(false); //fetching data is over ... we have the result in products state
    } catch (error) {
      console.error("Error fetching products: ", error);
      setLoading(false); //stop loading .. there is an error in fetching
    }
  };

  useEffect(() => {
    fetchProducts(); // Call the async function to fetch data
  }, []);

  //display react spinner until fetching data is done
  if (loading)
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
    <div>
      <h2>All Products</h2>
      {products.length > 0 ? (
        products.map((product) => {
          counter++;
          return (
            <h3
              key={product.id}
              style={{ cursor: "pointer" }}
              onClick={() => {
                router.push(`/products/${product.id}`); // Navigate to the product details page
              }}
            >
              {`this is product number ${counter} :`}
            </h3>
          );
        })
      ) : (
        <p>No products found</p> // in case there is no products or fetching data failed
      )}
    </div>
  );
}

export default Products;
