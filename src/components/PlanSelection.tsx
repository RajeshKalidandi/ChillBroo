import React from 'react';

export type Plan = 'freemium' | 'basic' | 'pro';

interface PlanSelectionProps {
  selectedPlan: Plan;
  onSelectPlan: (plan: Plan) => void;
}

const PlanSelection: React.FC<PlanSelectionProps> = ({ selectedPlan, onSelectPlan }) => {
  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-semibold mb-2">Select Your Plan</h2>
      <div className="flex space-x-4">
        <PlanCard
          title="Freemium"
          description="100 free credits"
          price="Free"
          selected={selectedPlan === 'freemium'}
          onSelect={() => onSelectPlan('freemium')}
        />
        <PlanCard
          title="Basic"
          description="500 credits"
          price="$9.99/month"
          selected={selectedPlan === 'basic'}
          onSelect={() => onSelectPlan('basic')}
        />
        <PlanCard
          title="Pro"
          description="Unlimited credits"
          price="$29.99/month"
          selected={selectedPlan === 'pro'}
          onSelect={() => onSelectPlan('pro')}
        />
      </div>
    </div>
  );
};

interface PlanCardProps {
  title: string;
  description: string;
  price: string;
  selected: boolean;
  onSelect: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ title, description, price, selected, onSelect }) => {
  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer ${
        selected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onClick={onSelect}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      <p className="text-lg font-bold mt-2">{price}</p>
    </div>
  );
};

export default PlanSelection;