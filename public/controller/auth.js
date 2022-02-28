import {
	getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js"

import * as Route from './routes.js'
import * as Elements from '../viewpage/elements.js'
import * as HomePage from '../viewpage/home_page.js'

const auth = getAuth();

export let currentUser;

export function addEventListeners() {

  Elements.formSignIn.addEventListener('submit', async e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const button = e.target.getElementsByTagName('button')[0];
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      alert(`Sign in Error\n${e}`);
    }
  });

  Elements.buttonSignOut.addEventListener('click', async e => {
    if (HomePage.unsubButtonsDoc) {
      HomePage.unsubButtonsDoc();
      console.log('button doc change: unsubscribed');
    }
    await signOut(auth);
  })

  onAuthStateChanged(auth, user => {
    if (user) {
      currentUser = user;

      let elements = document.getElementsByClassName('pre-auth');
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
      }
      elements = document.getElementsByClassName('post-auth');
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'block';
      }

      Route.routing(window.location.pathname, window.location.hash);

    } else {
      currentUser = null;

      let elements = document.getElementsByClassName('pre-auth');
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'block';
      }
      elements = document.getElementsByClassName('post-auth');
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
      }

      history.pushState(null, null, Route.routePathnames.HOME);
      Route.routing(window.location.pathname, window.location.hash);
    }
  });
}