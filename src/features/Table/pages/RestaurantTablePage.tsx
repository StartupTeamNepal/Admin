import React, { useState } from 'react';
import RestaurantTable from '../components/RestaurantTable';

export default function TableGrid() {
  const [selectedTableId, setSelectedTableId] = useState(null);

  return (
    <div className="flex gap-4 p-6">
      <RestaurantTable
        tableNumber={1}
        capacity={2}
        initialStatus="unbooked"
        isSelected={selectedTableId === 1}
        onSelect={() => setSelectedTableId(1)}
      />
      <RestaurantTable
        tableNumber={2}
        capacity={4}
        initialStatus="booked"
        isSelected={selectedTableId === 2}
        onSelect={() => setSelectedTableId(2)}
      />
      <RestaurantTable
        tableNumber={3}
        capacity={6}
        initialStatus="unavailable"
        isSelected={selectedTableId === 3}
        onSelect={() => setSelectedTableId(3)}
      />
    </div>
  );
}