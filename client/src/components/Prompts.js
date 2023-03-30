import Comments from "./Comments";
import NewCommentForm from "./NewCommentForm";
import { useState } from "react";

function Prompts({ prompts, comments, promptId, user }) {
  const [addComment, setAddComment] = useState(false);
  const [commentsArray, setCommentsArray] = useState(comments);

  // console.dir(comments);

  const comments_data = commentsArray?.map((data) => {
    return (
      <Comments key={data.id} comments={data.comment} userData={data.user} />
    );
  });

  function handleAddComment() {
    setAddComment(!addComment);
  }

  return (
    <>
      <div className="prompt">{prompts}</div>
      <div>{comments_data}</div>
      <div>
        <button onClick={handleAddComment}>
          {addComment ? "Close" : "Add Comment"}
        </button>
        {addComment ? (
          <NewCommentForm
            addComment={addComment}
            promptId={promptId}
            user={user}
            setCommentsArray={setCommentsArray}
            comments={commentsArray}
          />
        ) : null}
      </div>
    </>
  );
}

export default Prompts;
