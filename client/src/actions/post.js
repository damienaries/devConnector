import axios from 'axios';
import { setAlert } from './alert';
import {
    DELETE_POST,
    GET_POSTS,
    GET_POST,
    POST_ERROR,
    UPDATE_LIKES,
    ADD_POST
} from './types';

// GET POSTS
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/api/posts');

        dispatch({ 
            type: GET_POSTS, 
            payload: res.data
         })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

// ADD like
export const addLike = id => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/like/${id}`);

        dispatch({ 
            type: UPDATE_LIKES, 
            payload: { id, likes: res.data}
         })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

// Remove like
export const removeLike = id => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${id}`);

        dispatch({ 
            type: UPDATE_LIKES, 
            payload: { id, likes: res.data}
         })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

// DElete POST
export const deletePost = id => async dispatch => {
    try {
        await axios.delete(`/api/posts/${id}`);

        dispatch({ 
            type: DELETE_POST, 
            payload: id
         })

         dispatch(setAlert('Post successfully removed', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

// ADD POST
export const addPost = formData => async dispatch => {
    const config = {
        headers: {
        'Content-Type': 'application/json'
        }
    }
    try {
        const res = await axios.post('/api/posts', formData, config);

        dispatch({ 
            type: ADD_POST, 
            payload: res.data
         });

         dispatch(setAlert('Post successfully Created', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

// GET a single POST
export const getPost = id => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${id}`);

        dispatch({ 
            type: GET_POST, 
            payload: res.data
         })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}