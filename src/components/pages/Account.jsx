import { deleteObject, getStorage, ref } from "firebase/storage";
import { toast } from "react-toastify";
import { db } from "../../firebase.config";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { Loader } from "../Mode/Loader";
import { useEffect, useState } from "react";
import Admin from "./Admin";

const Account = () => {
  const [images, setImages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function getImages() {
      const queriedCol = query(
        collection(db, "images"),
        where("userRef", "==", `${auth.currentUser.uid}`),
        orderBy("timestamp", "desc")
      );
      onSnapshot(queriedCol, (snapshot) => {
        snapshot.forEach((doc) => {
          setImages((prev) => [...prev, { id: doc.id, ...doc.data() }]);
        });
      });
    }
    return () => getImages();
  }, []);

  const docRef = doc(db, "users", `${auth.currentUser.uid}`);

  async function checkIsAdmin() {
    try {
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();

        if (data.isAdmin === true) {
          setIsAdmin(true);
          navigate("/admin");
        } else {
          setIsAdmin(false);
          navigate("/account");
        }
      } else {
        return;
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  }

  checkIsAdmin();

  const handleDelete = () => {
    const storage = getStorage();
    const imageRef = ref(
      storage,
      "images/Mon Aug 26 2024-820ff1da-d46e-4d3e-9268-ffd8e30ceb42-0ea58659cf2fc01eeff44fee8cf1a353.jpg"
    );
    images.filter(async (image) => {
      if (image.id === "Ue1DzIbUTczAV3SZ3bpL") {
        await deleteDoc(doc(db, "images", image.id));
      }
    });
    console.log(imageRef);
    deleteObject(imageRef)
      .then(() => {
        toast.success("Image was deleted successfully.", {
          style: {
            color: "green",
          },
        });
      })
      .catch((error) => {
        toast.error("Sorry, we encountered an error while deleting the image", {
          style: {
            color: "red",
          },
        });
      });
  };

  const handleEdit = () => {
    navigate("/image-upload");
  };

  // const query = doc(collection(db, "users"), where("isAdmin", "==", "true"));
  // const docRef = query.get();

  if (images.length === 0) {
    return (
      <div className="loading w-screen h-screen fixed">
        <Loader fill={"black"} />
      </div>
    );
  } else {
    if (isAdmin) {
      <Admin />;
    } else {
      return (
        <div>
          <h3 className="font-bold text-slate-900 mb-6 pl-4 text-3xl mt-6">
            My Uploads{" "}
          </h3>
          <ul className="flex flex-col gap-y-4 mx-4">
            {images.map((image) => (
              <li className="bg-blue-50 rounded-lg shadow-md" key={image.id}>
                <div className="grid grid-cols-2 justify-between pt-2">
                  <h3 className="text-slate-800 font-bold pl-11">Image</h3>
                  <h3 className="text-slate-800 font-bold">Status</h3>
                </div>
                <div className="flex flex-row rounded-lg p-2 items-center justify-between">
                  <img
                    src={image.webformatURL}
                    alt="processing upload"
                    className="w-28 h-24 object-cover"
                  />{" "}
                  <p
                    className={
                      image.status !== "approved"
                        ? image.status === "denied"
                          ? "text-rose-500"
                          : "text-blue-500"
                        : "text-green-500"
                    }
                  >
                    {image.status}
                  </p>
                  <div>
                    <i
                      className="fa fa-edit fa-lg hover:text-blue-500"
                      onClick={handleEdit}
                    ></i>
                    <i
                      className="fa fa-trash fa-lg ml-3 mr-4 hover:text-rose-500"
                      onClick={handleDelete}
                    ></i>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <nav aria-label="Page navigation example" className="mt-4">
            <ul className="pagination justify-center">
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  3
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      );
    }
  }
};

export default Account;
