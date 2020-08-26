import {createStore,combineReducers,applyMiddleware} from 'redux';
import  thunk from 'redux-thunk';
import logger from 'redux-logger';
import {Comments} from './comments';
import {createForms} from 'react-redux-form';
import {InitialComment} from './forms';
export const ConfigureStore=()=>{
	const store=createStore(
		combineReducers({
			comments:Comments,
			...createForms({
				feedback:InitialComment
			})

		})
		,applyMiddleware(thunk,logger)
		);
	return store;
};