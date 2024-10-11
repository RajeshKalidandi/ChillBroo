import React, { useMemo } from 'react';

const ExpensiveComponent = ({ data }) => {
  const expensiveResult = useMemo(() => {
    // Perform expensive computation here
    return someExpensiveFunction(data);
  }, [data]);

  return (
    <div>
      {/* Render component using expensiveResult */}
    </div>
  );
};

export default ExpensiveComponent;