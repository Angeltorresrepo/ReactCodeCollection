import React from 'react';
import { Table } from 'antd';
import '../styles/Table.css'
function TableComponent({ filteredOptions = [], rates = {} }) {
  const columns = [
    {
      title: 'Currency',
      dataIndex: 'code',
      key: 'code',
      render: (code) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={`/svg/${code.toUpperCase()}.svg`}
            alt={code}
            style={{ width: 24, height: 24, marginRight: 8 }}
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
          {code}
        </div>
      ),
    },
    {
      title: 'Rate',
      dataIndex: 'code',
      key: 'rate',
      render: (code) => rates[code] ?? 'N/A',
    },
  ];

  const dataSource = filteredOptions.map((item, idx) => ({
    key: idx,
    code: item.code,
  }));

  return <Table className='table' columns={columns} dataSource={dataSource} pagination={{ pageSize: 10, showTotal: () => '' }} />;
}

export default TableComponent;
