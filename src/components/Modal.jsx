import { useState } from "react";

const Modal = () => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    // const docRef = doc(db, "images", id);

    // if (e.target.value.length > 3) {
    //   if (typeof id == "string") {
    //     await updateDoc(docRef, {
    //       comments: +comments + 1,
    //     });
    //   } else {
    //     setComment("");
    //   }
    // }
    setComment("");
  };

  return (
    <div>
      <button
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        data-bs-whatever="@getbootstrap"
      >
        <i
          className={"fa fa-comment-o hover:text-rose-600"}
          aria-hidden="true"
        ></i>
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                New comment
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label for="message-text" className="col-form-label">
                    Comment:
                  </label>
                  <textarea
                    className="form-control"
                    id="message-text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="reset"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleSubmit}
              >
                Send message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
