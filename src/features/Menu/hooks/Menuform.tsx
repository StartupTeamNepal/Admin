import { useState } from 'react';

export function useMenuOption() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  return {
    isFormOpen,
    openForm,
    closeForm,
  };
}