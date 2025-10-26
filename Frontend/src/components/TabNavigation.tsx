interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  "Our Services",
  "Summer Services",
  "How AutoMex Works",
  "Rating & Reviews",
  "FAQ",
];

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center overflow-x-auto scrollbar-hide py-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`py-2.5 px-5 text-sm font-semibold rounded-full transition-all duration-200 mx-1 whitespace-nowrap ${
                activeTab === tab
                  ? "bg-primary text-white shadow-lg transform scale-105"
                  : "text-gray-700 hover:bg-gray-100 hover:text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;

