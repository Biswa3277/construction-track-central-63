
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TeamMemberDashboard from "@/features/team/components/TeamMemberDashboard";
import { TeamMember } from "@/features/team/types/teamTypes";

const generateTeamMembers = (): TeamMember[] => {
  return [
    {
      id: "tm001",
      name: "John Smith",
      email: "john.smith@company.com",
      role: "administrator",
      department: "Administration",
      isActive: true,
      joinDate: "2024-01-15"
    },
    {
      id: "tm002",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "project-manager",
      department: "Engineering",
      teamLeadId: "tm001",
      isActive: true,
      joinDate: "2024-01-20"
    },
    {
      id: "tm003",
      name: "Mike Wilson",
      email: "mike.wilson@company.com",
      role: "engineer",
      department: "Engineering",
      teamLeadId: "tm002",
      isActive: true,
      joinDate: "2024-02-01"
    },
    {
      id: "tm004",
      name: "Lisa Brown",
      email: "lisa.brown@company.com",
      role: "hr",
      department: "Human Resources",
      isActive: true,
      joinDate: "2024-01-10"
    }
  ];
};

const TeamMemberDashboardPage = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    const members = generateTeamMembers();
    const foundMember = members.find(m => m.id === memberId);
    if (foundMember) {
      setMember(foundMember);
    } else {
      navigate("/team-management");
    }
  }, [memberId, navigate]);

  const handleBack = () => {
    navigate("/team-management");
  };

  if (!member) {
    return <div>Loading...</div>;
  }

  return <TeamMemberDashboard member={member} onBack={handleBack} />;
};

export default TeamMemberDashboardPage;
