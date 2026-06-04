"use client";
import { Box } from "@mui/material";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntegrationsSection from "@/components/shared/IntegrationsSection";
import HeroSection from "./components/HeroSection";
import WhyGovernanceMatters from "./components/WhyGovernanceMatters";
import DifferenceSection from "./components/DifferenceSection";
import ProcessOverview from "./components/ProcessOverview";
import ProcessDetailSection from "./components/ProcessDetailSection";
import CollaborationSection from "./components/CollaborationSection";
import PanelMembersSection from "./components/PanelMembersSection";
import MemberModal from "./components/MemberModal";
import { processSteps } from "./governanceData";

const GovernancePageClient = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedMember(null), 300);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <HeroSection />
      <WhyGovernanceMatters />
      <DifferenceSection />
      <ProcessOverview />
      {processSteps.map((step, index) => (
        <ProcessDetailSection key={step.id} step={step} index={index} />
      ))}
      <CollaborationSection />
      <PanelMembersSection onMemberClick={handleMemberClick} />
      <IntegrationsSection />
      <Footer />
      <MemberModal
        member={selectedMember}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </Box>
  );
};

export default GovernancePageClient;
