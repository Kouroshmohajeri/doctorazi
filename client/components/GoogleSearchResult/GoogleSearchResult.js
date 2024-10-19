import React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import styles from './GoogleSearchResult.module.css';

const GoogleSearchResult = ({ title, description, url }) => {
  // Replace spaces with hyphens in the URL
  const formattedUrl = url.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={styles.googleResult}>
      <Link href={url} sx={{ textDecoration: 'none', color: '#1A0EAB' }}>
        <Typography variant="h5" sx={{ marginBottom: '8px', fontWeight: 'bold' }}>
          {title}
        </Typography>
      </Link>
      <Link href={formattedUrl} sx={{ color: 'green' }}>{`https://mydoctor.com/blog/${formattedUrl}`}</Link>
      <Typography variant="body1" sx={{ marginBottom: '8px' }}>{description}</Typography>
    </div>
  );
};

export default GoogleSearchResult;
