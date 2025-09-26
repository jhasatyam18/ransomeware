const PlanListWorkloadRenderer = ({ data }) => {
  if (!data) return;

  const { protectedEntities,
  } = data;
  const { virtualMachines } = protectedEntities;
  return (
    virtualMachines.length
  );
};

export default PlanListWorkloadRenderer;
