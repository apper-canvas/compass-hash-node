import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick, title = "Dashboard" }) => {
  return (
    <header className="lg:pl-64 bg-surface shadow-sm border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden mr-3 p-2"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <h1 className="text-xl font-semibold text-slate-800">
            {title}
          </h1>
        </div>
<div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="p-2">
            <ApperIcon name="Bell" size={20} />
          </Button>
          
          <Button variant="ghost" size="sm" className="p-2">
            <ApperIcon name="Settings" size={20} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2"
            onClick={async () => {
              try {
                const { ApperUI } = window.ApperSDK;
                await ApperUI.logout();
                window.location.href = '/login';
              } catch (error) {
                console.error("Logout failed:", error);
              }
            }}
            title="Logout"
          >
            <ApperIcon name="LogOut" size={20} />
          </Button>
          
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-700 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;