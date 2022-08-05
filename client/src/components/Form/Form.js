import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper,FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { useHistory } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';

import { createPost, updatePost } from '../../actions/posts';
import useStyles from './styles';

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({ title: '', message: '', tags: [], selectedFile: '' });
  const post = useSelector((state) => (currentId ? state.posts.posts.find((message) => message._id === currentId) : null));
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));
  const history = useHistory();
  const [tag, setTag] = useState('');

  const clear = () => {
    setCurrentId(0);
    setPostData({ title: '', message: '', tags: [], selectedFile: '' });
  };

  useEffect(() => {
    if (!post?.title) clear();
    if (post) setPostData(post);
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      dispatch(createPost({ ...postData, name: user?.result?.name }, history));
      clear();
    } else {
      dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
      clear();
    }
  };

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper} elevation={6}>
        <Typography variant="h6" align="center">
          Chào mừng đến IT03-K63
        </Typography>
      </Paper>
    );
  }

  const handleAddChip = (tag) => {
    setPostData({ ...postData, tags: [...postData.tags, tag] });
  };

  const handleDeleteChip = (chipToDelete) => {
    setPostData({ ...postData, tags: postData.tags.filter((tag) => tag !== chipToDelete) });
  };

  const handleChange = (e) => {
    setTag(e.target.value);
    console.log(tag);
    //setPostData({ ...postData, tags: [...postData.tags, tag] });
    //setPostData({ ...postData, tags: [...postData.tags, tag] });
    
     // setPostData({ ...postData, tags: [...postData.tags, tag] });
     setPostData({ ...postData, tags: [...postData.tags, e.target.value] });
  }

  return (
    <Paper className={classes.paper} elevation={6}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{currentId ? `Editing "${post?.title}"` : 'Tạo bài đăng'}</Typography>
        <TextField name="title" variant="outlined" label="Tiêu đề" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />
        <TextField name="message" variant="outlined" label="Nội dung" fullWidth multiline rows={4} value={postData.message} onChange={(e) => setPostData({ ...postData, message: e.target.value })} />
        <div style={{ padding: '5px 0', width: '94%' }}>
          <ChipInput
            name="tags"
            variant="outlined"
            label="Chủ đề"
            fullWidth
            value={postData.tags}
            onAdd={(chip) => handleAddChip(chip)}
            onDelete={(chip) => handleDeleteChip(chip)}
          />
        </div>
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Chủ đề</InputLabel>
        <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={tag}
        label=""
        onChange={handleChange}
        
        >
      <MenuItem value={'Học bổng'}>Học bổng</MenuItem>
      <MenuItem value={'Điểm rèn luyện'}>Điểm rèn luyện</MenuItem>
      <MenuItem value={'Thực tập'}>Thực tập</MenuItem>
      </Select>
      </FormControl>
        <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} /></div>
        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Đăng bài</Button>
        <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Xóa</Button>
      </form>
    </Paper>
  );
};

export default Form;
