import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import PostDetail from './PostDetail/PostDetail';
import Login from './Login/Login';
import CreatePost from '../components/CreatePost/CreatePostV2';
import Signup from './Signup';
import { switchOpen, setComponent } from '../actions/modal';

const ModalContainer = (props) => {
    let style={
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
        },
        content: {
          position: 'absolute',
          top: '40px',
          left: '40px',
          right: '40px',
          bottom: '40px',
          border: '0px',
          background: '#2D3142',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '10px',
          outline: 'none',
          padding: '20px',
          paddingTop: '50px',
        }
      }
      if (window.innerWidth < 800) {
        style.content.top = 30;
        style.content.left = 10;
        style.content.right = 10;
        style.content.bottom = 30;
      }
    return (
        <div>
            <Modal
                isOpen={props.modal.open}
                ariaHideApp={false}
                style={style}
                bodyOpenClassName={'ReactModal__Body--open'}
            >
                <div>
                    <button className='modal__button' onClick={() => {
                        props.switchOpen(false)
                        props.setComponent(undefined)
                    }}>Close</button>
                    {props.modal.component === 'PostDetail' &&
                        <PostDetail id={props.modal.postDetailId}/>
                    }
                    {props.modal.component === 'CreatePost' &&
                        <CreatePost />
                    }
                    {props.modal.component === 'Login' &&
                        <Login />
                    }
                    {props.modal.component === 'Signup' &&
                        <Signup />
                    }
                </div>
            </Modal>
        </div>
    )
}

const setStateToProps = (state) => {
    return {
        modal: state.modal
    }
}

const setDispatchToProps = { switchOpen, setComponent }

export default connect(setStateToProps, setDispatchToProps)(ModalContainer);