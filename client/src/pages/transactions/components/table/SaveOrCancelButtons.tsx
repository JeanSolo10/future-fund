import { Popconfirm, Typography } from 'antd';
import type React from 'react';

type Props = {
  onSave: () => void;
  onCancel: () => void;
};

export const SaveOrCancelButtons: React.FC<Props> = ({ onSave, onCancel }) => {
  return (
    <span>
      <Typography.Link onClick={onSave} style={{ marginInlineEnd: 8 }}>
        Save
      </Typography.Link>
      <Popconfirm title="Sure to cancel?" onConfirm={onCancel}>
        <a>Cancel</a>
      </Popconfirm>
    </span>
  );
};
