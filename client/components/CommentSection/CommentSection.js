"use client";
import React, { useContext, useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import { UserDataContext } from '@/context/UserDatasContext';
import { createComment } from '@/lib/actions/comments/actions';
import { ClinicalRecordContext } from '@/context/ClinicalRecordContext';

const CommentSection = ({ postId, type }) => {
  const { users, fetchCookies } = useContext(UserDataContext);
  const [commentInput, setCommentInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [mathProblem, setMathProblem] = useState('');
  const [answer, setAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const {refresh,setRefresh} = useContext(ClinicalRecordContext);

  useEffect(() => {
    fetchCookies().then(() => {
      setLoading(false);
    });
  }, []);

  const handleCommentChange = (event) => {
    setCommentInput(event.target.value);
  };

  const handleCommentSubmit = () => {
    if (commentInput.trim() !== '') {
      generateMathProblem(); 
      setModalOpen(true);
    }
  };

  const generateMathProblem = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const result = num1 + num2;
    setMathProblem(`${num1} + ${num2}`);
    setAnswer(result.toString());
  };

  const handleAnswerChange = (event) => {
    setUserAnswer(event.target.value);
  };

  const handleVerifyAnswer = async () => {
    if (userAnswer === answer) {
      try {
        const commentData = {
          post_id: postId,
          user_id: users.id, 
          expressionId: type, 
          comment_text: commentInput,
        };
        await createComment(commentData);
      } catch (error) {
        console.error('Error creating comment:', error);
      }

      // Reset states
      setCommentInput('');
      setUserAnswer('');
      setModalOpen(false);
      setRefresh(!refresh);
    } else {
      // Handle incorrect answer
      alert('Incorrect answer. Please try again.');
    }
  };

  const handleLogin = () => {
    // Handle login logic here
    console.log('Redirect to login page');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '55vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!users.id&&localStorage.getItem("calendar")/8312!==users.id) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '55vh' }}>
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', mx: 'auto', mt: 4 }}>
      <Paper elevation={0} sx={{ p: 8, border: 'none' }}>
        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>
        <TextField
          label="Add a comment"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={commentInput}
          onChange={handleCommentChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCommentSubmit}
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </Paper>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" id="modal-title" gutterBottom>
            Solve the Math Problem
          </Typography>
          <Typography variant="subtitle1" id="modal-description" gutterBottom>
            {mathProblem}
          </Typography>
          <TextField
            label="Your Answer"
            variant="outlined"
            fullWidth
            value={userAnswer}
            onChange={handleAnswerChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleVerifyAnswer}
            sx={{ mt: 2 }}
          >
            Verify Answer
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default CommentSection;