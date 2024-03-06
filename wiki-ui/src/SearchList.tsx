import React from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface SearchList {
  title: string;
  desc: string;
}

interface SearchListProps {
  data: SearchList[];
  noResultFound: boolean;
}

const SearchList: React.FC<SearchListProps> = ({ data, noResultFound }) => {
  interface RowProps {
    index: number;
    style: React.CSSProperties;

  }

  const Row: React.FC<RowProps> = ({ index, style }) => {
    const { title, desc } = data[index];

    return <div style={style}>
      <div>
        <strong>{title}</strong>
      </div>
      <div dangerouslySetInnerHTML={{ __html: desc }} />
      <hr />
    </div>
  };

  return noResultFound ? <h4> No Results Found</h4 > :
    (<AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          itemCount={data.length}
          itemSize={130}
          width={width}
        >
          {Row}
        </List>
      )}
    </AutoSizer>
    );
};

export default SearchList;