import React from 'react';
import AddMenuOptionButton from '../components/AddmenuButton';
import MenuOptionForm from '../forms/AddmenuForm';
import { useMenuOption } from '../hooks/Menuform';

export default function Menupage() {
  const {
    isFormOpen,
    openForm,
    closeForm,
  } = useMenuOption();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Menu
        </h1>

        {/* Button uses onAdd */}
        <AddMenuOptionButton onAdd={openForm} />
      </div>

      <div className="text-slate-600 dark:text-slate-400">
        This is menu home page
      </div>

      {/* Form uses onClose */}
      {isFormOpen && (
        <MenuOptionForm onClose={closeForm} />
      )}
    </div>
  );
}