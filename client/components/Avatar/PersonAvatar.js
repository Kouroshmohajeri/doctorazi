import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

export default function PersonAvatar({alt,image}) {
  return (
    <Stack direction="row" spacing={2}>
      <Avatar
        alt={alt}
        src={image}
        sx={{ width: 300, height: 300 }}
      />
    </Stack>
  );
}