import { firebaseAuth, firebaseDatabase } from '../helpers/firebase';
import { push } from 'connected-react-router';

export const actionTypes = {
  listenToFirebaseAuth: 'LISTEN_FIREBASE_AUTH',
  authStarted: 'AUTH_STARTED',
  authFulfilled: 'AUTH_FULFILLED',
  authRejected: 'AUTH_REJECTED',
  logout: 'LOGOUT',
  fetchRandomStoriesFulfilled: 'FETCH_RANDOM_STORIES_FULFILLED',
  fetchRandomStoriesRejected: 'FETCH_RANDOM_STORIES_REJECTED',
  fetchRandomStoriesStarted: 'FETCH_RANDOM_STORIES_STARTED',
  selectStory: 'SELECT_STORY',
  checkTeacherCodeRejected: 'CHECK_TEACHER_CODE_REJECTED',
  checkTeacherCodeFulfilled: 'CHECK_TEACHER_CODE_FULFILLED',
  checkingTeacherCode: 'CHECKING_TEACHER_CODE',
  createRoomStarted: 'CREATE_ROOM_STARTED',
  createRoomFulfilled: 'CREATE_ROOM_FULFILLED',
  createRoomRejected: 'CREATE_ROOM_REJECTED',
  fetchRoomDataStarted: 'FETCH_ROOM_DATA_STARTED',
  fetchRoomDataFulfilled: 'FETCH_ROOM_DATA_FULFILLED',
  fetchRoomDataRejected: 'FETCH_ROOM_DATA_REJECTED',
  listenForRoomChangeStarted: 'LISTEN_FOR_ROOM_CHANGE_STARTED',
  listenForRoomChangeFulfilled: 'LISTEN_FOR_ROOM_CHANGE_FULFILLED',
  listenForRoomChangeRejected: 'LISTEN_FOR_ROOM_CHANGER_REJECTED',
  updateModuleStarted: 'UPDATE_MODULE_STARTED',
  updateModuleFulfilled: 'UPDATE_MODULE_FULFILLED',
  updateModuleRejected: 'UPDATE_MODULE_REJECTED',
  showToast: 'SHOW_TOAST',
  destroyToast: 'DESTROY_TOAST',
  showModal: 'SHOW_MODAL',
  destroyModal: 'DESTROY_MODAL',
  fetchSuggestionsFulfilled: 'FETCH_SUGGESTIONS_FULFILLED',
  fetchSuggestionsRejected: 'FETCH_SUGGESTIONS_REJECTED',
  getRandomSuggestionsFulfilled: 'GET_RANDOM_SUGGESTIONS_FULFILLED',
  getRandomSuggestionsStarted: 'GET_RANDOM_SUGGESTIONS_STARTED'
};

export const showToast = toast => ({ type: actionTypes.showToast, toast });
export const destroyToast = () => ({ type: actionTypes.destroyToast });
export const showModal = id => ({ type: actionTypes.showModal, id });
export const destroyModal = () => ({ type: actionTypes.destroyModal });

export const fetchRandomStoriesStarted = () => ({
  type: actionTypes.fetchRandomStoriesStarted
});
export const fetchRandomStoriesFulfilled = stories => ({
  type: actionTypes.fetchRandomStoriesFulfilled,
  stories
});
export const fetchRandomStoriesRejected = error => ({
  type: actionTypes.fetchRandomStoriesRejected,
  error
});
export const fetchRandomStories = () => {
  return dispatch => {
    dispatch(fetchRandomStoriesStarted());
    firebaseDatabase
      .ref('/stories')
      .once('value')
      .then(snapshot => {
        dispatch(fetchRandomStoriesFulfilled(snapshot.val()));
      })
      .catch(err => {
        dispatch(fetchRandomStoriesRejected(err));
      });
  };
};

export const selectStory = story => ({
  type: actionTypes.selectStory,
  story
});

export const checkTeacherCode = event => {
  return dispatch => {
    dispatch(checkingTeacherCode());
    const code = event.target.value;
    if (code === '')
      return dispatch(checkTeacherCodeRejected('No empty string allowed'));
    firebaseDatabase
      .ref('/tokens')
      .child(code)
      .once('value')
      .then(snapshot => {
        const val = snapshot.val();
        if (val) dispatch(checkTeacherCodeFulfilled(snapshot.val()));
        else dispatch(checkTeacherCodeRejected('No such code'));
      })
      .catch(err => {
        dispatch(checkTeacherCodeRejected('No such code'));
      });
  };
};

export const checkingTeacherCode = () => ({
  type: actionTypes.checkingTeacherCode
});

export const checkTeacherCodeFulfilled = ({ classId, userId }) => ({
  type: actionTypes.checkTeacherCodeFulfilled,
  error: '',
  classId,
  userId
});

export const checkTeacherCodeRejected = errorString => ({
  type: actionTypes.checkTeacherCodeRejected,
  error: errorString
});

export const createRoom = () => {
  return (dispatch, getState) => {
    dispatch(createRoomStarted());

    firebaseAuth.signInAnonymously().then(user => {}).catch(err => {
      dispatch(createRoomRejected(err.message));
    });

    const roomKey = firebaseDatabase.ref().child('rooms').push().key;
    const data = {
      ...getState().room,
      users: [getState().user]
    };
    data.id = roomKey;
    let updates = {};
    updates['/rooms/' + roomKey] = data;
    firebaseDatabase
      .ref()
      .update(updates)
      .then(result => {
        dispatch(createRoomFulfilled(data));
        dispatch(push(`/rooms/${roomKey}`));
      })
      .catch(err => {
        dispatch(createRoomRejected(err.message));
      });
  };
};

export const logout = () => {
  firebaseAuth.signOut();
  return { type: actionTypes.logout };
};

export const authStarted = () => ({ type: actionTypes.authStarted });

export const authFulfilled = user => ({
  type: actionTypes.authFulfilled,
  user
});
export const authRejected = error => ({
  type: actionTypes.authRejected,
  error
});
export const listenToFirebaseAuth = () => {
  return dispatch => {
    dispatch(authStarted());
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        const path = `users/${user.uid}`;
        const userData = Object.assign({}, user.providerData[0], {
          uid: user.uid
        });
        const userRef = firebaseDatabase.ref(path);

        dispatch(authFulfilled(userData));

        userRef.once('value').then(snapshot => {
          const val = snapshot.val();
          const newVal = { ...val, ...userData };
          userRef.set(newVal);
          dispatch(authFulfilled(newVal));
        });
      } else {
        dispatch(authRejected(''));
      }
    });
  };
};

export const createRoomStarted = () => ({
  type: actionTypes.createRoomStarted
});

export const createRoomFulfilled = newRoom => ({
  type: actionTypes.createRoomFulfilled,
  newRoom: newRoom
});

export const createRoomRejected = err => ({
  type: actionTypes.createRoomRejected,
  error: err
});

export const fetchRoomData = () => {
  return (dispatch, getState) => {
    dispatch(fetchRoomDataStarted());
    const roomId = getState().router.location.pathname.split('/rooms/')[1];

    firebaseDatabase
      .ref()
      .child('rooms')
      .child(roomId)
      .once('value')
      .then(response => {
        dispatch(fetchRoomDataFulfilled(response.val()));
      })
      .then(r => {
        dispatch(listenForRoomChange());
      })
      .catch(err => {
        dispatch(fetchRoomDataRejected(err));
      });

    firebaseDatabase
      .ref()
      .child('appsuggestions')
      .once('value')
      .then(response => {
        dispatch(fetchSuggestionsFulfilled(response.val()));
      })
      .then(r => {
        dispatch(getRandomSuggestions());
      })
      .catch(err => {
        dispatch(fetchSuggestionsRejected(err));
      });
  };
};

export const fetchRoomDataStarted = () => ({
  type: actionTypes.fetchRoomDataStarted
});

export const fetchRoomDataFulfilled = data => ({
  type: actionTypes.fetchRoomDataFulfilled,
  newRoom: data
});

export const fetchRoomDataRejected = err => ({
  type: actionTypes.fetchRoomDataRejected,
  error: err
});

export const listenForRoomChange = () => {
  return (dispatch, getState) => {
    dispatch(listenForRoomChangeStarted());
    const roomId = getState().router.location.pathname.split('/rooms/')[1];
    firebaseDatabase.ref('/rooms/' + roomId).on('value', snapshot => {
      dispatch(listenForRoomChangeFulfilled(snapshot.val()));
    });
  };
};

export const listenForRoomChangeStarted = () => ({
  type: actionTypes.listenForRoomChangeStarted
});

export const listenForRoomChangeFulfilled = data => ({
  type: actionTypes.listenForRoomChangeFulfilled,
  newRoomData: data
});

export const listenForRoomChangeRejected = errorMessage => ({
  type: actionTypes.listenForRoomChangeRejected,
  error: errorMessage
});

export const updateModule = module => {
  return (dispatch, getState) => {
    dispatch(updateModuleStarted());
    firebaseDatabase
      .ref()
      .child('rooms')
      .child(getState().room.id)
      .child('modules')
      .child(module.id)
      .set({
        ...module
      })
      .then(snapshot => {
        dispatch(updateModuleFulfilled());
      })
      .catch(err => {
        dispatch(updateModuleRejected(err.message));
      });
  };
};

export const updateModuleStarted = () => ({
  type: actionTypes.updateModuleStarted
});

export const updateModuleFulfilled = () => ({
  type: actionTypes.updateModuleFulfilled
});

export const updateModuleRejected = errorMessage => ({
  type: actionTypes.updateModuleRejected,
  error: errorMessage
});

export const fetchSuggestionsFulfilled = data => ({
  type: actionTypes.fetchSuggestionsFulfilled,
  data: data
});

export const fetchSuggestionsRejected = err => ({
  type: actionTypes.fetchSuggestionsRejected,
  error: err.message
});

export const getRandomSuggestions = () => {
  return (dispatch, getState) => {
    dispatch(getRandomSuggestionsStarted());
    let randomNumbers = [];
    let randomSuggestions = [];

    if (getState().suggestions.suggestions.length < 4) {
      return dispatch(
        getRandomSuggestionsFulfilled(getState().suggestions.suggestions)
      );
    }

    while (randomNumbers.length !== 4) {
      let n = Math.floor(
        Math.random() * getState().suggestions.suggestions.length
      );
      if (randomNumbers.indexOf(n) === -1) {
        randomNumbers.push(n);
      }
    }

    let i = 0;
    while (randomSuggestions.length !== 4) {
      randomSuggestions.push(
        getState().suggestions.suggestions[randomNumbers[i]]
      );
      i++;
    }

    dispatch(getRandomSuggestionsFulfilled(randomSuggestions));
  };
};

export const getRandomSuggestionsStarted = () => ({
  type: actionTypes.getRandomSuggestionsStarted
});

export const getRandomSuggestionsFulfilled = suggestions => ({
  type: actionTypes.getRandomSuggestionsFulfilled,
  suggestions: suggestions
});
