import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

interface TeamMember {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

const TeamManagement: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'admin' | 'editor' | 'viewer'>('editor');

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'team_members'), where('teamId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    const members: TeamMember[] = [];
    querySnapshot.forEach((doc) => {
      members.push({ id: doc.id, ...doc.data() } as TeamMember);
    });
    setTeamMembers(members);
  };

  const addTeamMember = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, 'team_members'), {
      teamId: user.uid,
      email: newMemberEmail,
      role: newMemberRole
    });
    setNewMemberEmail('');
    setNewMemberRole('editor');
    fetchTeamMembers();
  };

  const removeTeamMember = async (memberId: string) => {
    await deleteDoc(doc(db, 'team_members', memberId));
    fetchTeamMembers();
  };

  return (
    <div>
      <h2>Team Management</h2>
      <div>
        <input
          type="email"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
          placeholder="New member email"
        />
        <select value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value as 'admin' | 'editor' | 'viewer')}>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
        <button onClick={addTeamMember}>Add Member</button>
      </div>
      <ul>
        {teamMembers.map((member) => (
          <li key={member.id}>
            {member.email} - {member.role}
            <button onClick={() => removeTeamMember(member.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamManagement;