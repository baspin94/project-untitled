import MemberPanel from "./MemberPanel";
import BookPanel from "./BookPanel";
import DiscussionPanel from "./DiscussionPanel";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function HostGroup({ user }) {
  const params = useParams();
  const groupId = params["groupId"];

  const [selectedGroup, setSelectedGroup] = useState([]);
  const [members, setMembers] = useState([]);
  const [featuredBook, setFeaturedBook] = useState([]);
  const [prompts, setPrompts] = useState([])

  useEffect(() => {
    function setMembersandBooks(data) {
      const membershipArray = data["memberships"];

      const updatedUserArray = membershipArray.map((member) => {
        const userObject = member.user;
        userObject.member_id = member.id;
        return userObject;
      });
      setMembers(updatedUserArray);

      const book = data.books[0];
      setFeaturedBook(book);
      setPrompts(book.prompts);
    }

    fetch(`/host_group/${groupId}`)
      .then((res) => res.json())
      .then((groupData) => {
        setSelectedGroup(groupData);
        setMembersandBooks(groupData);
      });
  }, [groupId]);

  return (
    <>
      <h1>{selectedGroup.name}</h1>
      <Link exact to='/'><button>Back to Groups</button></Link>
      <div className="hostPanels">
        <MemberPanel
          members={members}
          setMembers={setMembers}
          featuredBook={featuredBook}
          prompts={prompts}
          setPrompts={setPrompts}
        />
        <BookPanel book={featuredBook} />
        <DiscussionPanel book={featuredBook} user={user} prompts={prompts}/>
      </div>
    </>
  );
}

export default HostGroup;
