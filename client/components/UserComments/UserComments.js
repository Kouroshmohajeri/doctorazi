"use client";
import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { getCommentsByPostAndExpression } from '@/lib/actions/comments/actions';
import { getFullNameById } from '@/lib/actions/users/actions';
import { format } from 'date-fns';
import jalaali from 'jalaali-js';
import { ClinicalRecordContext } from '@/context/ClinicalRecordContext';

const UserComments = ({ postId, expressionId, locale }) => {
  const [comments, setComments] = useState([]);
  const { refresh } = useContext(ClinicalRecordContext);

  const formatDate = (dateString, locale) => {
    const date = new Date(dateString);
    if (locale === 'fa') {
      const jalaliDate = jalaali.toJalaali(date);
      return `${jalaliDate.jy}/${String(jalaliDate.jm).padStart(2, '0')}/${String(jalaliDate.jd).padStart(2, '0')}`;
    } else {
      return format(date, 'yyyy/MM/dd');
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await getCommentsByPostAndExpression(postId, expressionId);

        const commentsWithUserNames = await Promise.all(commentsData.map(async (comment) => {
          const { fullName } = await getFullNameById(comment.user_id);
          return {
            ...comment,
            username: fullName,
            comment_date: formatDate(comment.comment_date, locale),
            original_comment_date: comment.comment_date // Keep the original date for sorting
          };
        }));

        // Sort comments from newest to oldest using the original_comment_date
        const sortedComments = commentsWithUserNames.sort((a, b) => new Date(b.original_comment_date) - new Date(a.original_comment_date));

        setComments(sortedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [postId, expressionId, locale, refresh]);

  return (
    <Card elevation={0} sx={{ border: 'none' }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Comments
        </Typography>
        {comments.length > 0 ? (
          <List>
            {comments.map((comment) => (
              <div key={comment.comment_id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={comment.username}
                    secondary={
                      <>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {comment.comment_date}
                        </Typography>
                        {" — "}{comment.comment_text}
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </div>
            ))}
          </List>
        ) : (
          <Typography variant="body2" className='mx-auto' color="text.secondary">
            No comments yet
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default UserComments;
