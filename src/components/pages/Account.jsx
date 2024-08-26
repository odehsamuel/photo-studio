import { deleteObject, getStorage, ref } from "firebase/storage";
import chick from "../Mode/_g73df6e99215abe2cfd07359c9586141294b101fda48f200514e9c5ef48e71cbc7e8d589167e19a46e84b159ac379e10ce6f4cba3c6c82d003baecea327915664_640.jpg";
import { toast } from "react-toastify";
import { db } from "../../firebase.config";
import { deleteDoc, doc } from "firebase/firestore";

const Account = () => {
  const handleDelete = async() => {
    const storage = getStorage();
    const imageRef = ref(storage, "images/Mon Aug 26 2024-820ff1da-d46e-4d3e-9268-ffd8e30ceb42-0ea58659cf2fc01eeff44fee8cf1a353.jpg");
    // await deleteDoc(doc(db, "images", id));
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

  return (
    <div>
      <h3 className="font-bold text-slate-900 mb-6 pl-4 text-3xl mt-6">
        My Account{" "}
      </h3>
      <ul className="flex flex-col gap-y-4 mx-4">
        <li className="bg-blue-50 rounded-lg shadow-md">
          <div className="grid grid-cols-2 justify-between pt-2 pl-7">
            <h3 className="text-slate-800 font-bold">Image</h3>
            <h3 className="text-slate-800 font-bold">Status</h3>
          </div>
          <div className="flex flex-row rounded-lg p-2 items-center justify-between">
            <img src={chick} alt="processing upload" />{" "}
            {/* <p className="text-green-500">Approved</p> */}
            {/* <p className="text-rose-500">Denied</p> */}
            <p className="text-blue-500 ">Processing</p>
            <div>
              <i className="fa fa-edit fa-lg"></i>
              <i
                className="fa fa-trash fa-lg ml-3 mr-4"
                onClick={handleDelete}
              ></i>
            </div>
          </div>
        </li>
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
};

export default Account;
