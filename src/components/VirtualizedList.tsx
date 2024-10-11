import React from 'react';
import { FixedSizeList as List } from 'react-window';

const VirtualizedList = ({ items, itemHeight, windowHeight }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      {/* Render your list item here */}
      {items[index]}
    </div>
  );

  return (
    <List
      height={windowHeight}
      itemCount={items.length}
      itemSize={itemHeight}
      width="100%"
    >
      {Row}
    </List>
  );
};

export default VirtualizedList;

// Use this component in places where you have long lists, like in the Templates page