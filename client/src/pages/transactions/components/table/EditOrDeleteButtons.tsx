import { Popconfirm, Typography } from 'antd';
import type React from 'react';

type Props = {
  isAnyRowEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export const EditOrDeleteButtons: React.FC<Props> = ({
  isAnyRowEditing,
  onEdit,
  onDelete,
}) => {
  return (
    <span>
      <Typography.Link
        disabled={isAnyRowEditing}
        onClick={onEdit}
        style={{ marginInlineEnd: 8 }}
      >
        Edit
      </Typography.Link>
      <Popconfirm
        title="Are you sure you want to delete this income?"
        onConfirm={onDelete}
      >
        <Typography.Link disabled={isAnyRowEditing} type="danger">
          Delete
        </Typography.Link>
      </Popconfirm>
    </span>
  );
};
