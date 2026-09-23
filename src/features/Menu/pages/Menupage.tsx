import React from 'react';
import AddButton from '../components/AddButton';
import { useNavigate } from 'react-router';

export default function Menupage() {
  const navigate = useNavigate();

  const handleAddMenu = () => {
    navigate('/menu-add');
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Menu
        </h1>

        <AddButton
          label="Add Menu Option"
          ariaLabel="Add menu option"
          onClick={handleAddMenu}
        />
      </div>

      <div className="text-slate-600 dark:text-slate-400">
        This is menu home page
      </div>
    </div>
  );
}