(() => {
  'use strict';
  const ready = () => {
    const config = window.DAYMARK_FIREBASE_CONFIG;
    let auth = null;
    if (window.firebase && config && config.apiKey && config.projectId) {
      try {
        if (!firebase.apps.length) firebase.initializeApp(config);
        auth = firebase.auth();
        auth.onAuthStateChanged(user => {
          document.querySelectorAll('[data-account-label]').forEach(el => {
            el.textContent = user ? `Signed in · ${user.displayName || user.email}` : 'Sign in';
          });
          document.querySelectorAll('[data-account-signout]').forEach(el => el.hidden = !user);
          if(user){try{const key='daymark:v1',saved=JSON.parse(localStorage.getItem(key)||'{}');saved.user=saved.user||{};if(!saved.user.name){saved.user.name=user.displayName||(user.email||'').split('@')[0]||'Friend';saved.user.onboarded=true;localStorage.setItem(key,JSON.stringify({...saved,...(saved.user.name?{}:{user:saved.user})}));location.reload()}}catch{}}
        });
      } catch (error) { console.error('Daymark account setup failed', error); }
    }
    const enabled = Boolean(auth);
    const open = () => {
      document.getElementById('daymark-auth-modal')?.remove();
      const modal = document.createElement('div');
      modal.id = 'daymark-auth-modal';
      modal.className = 'modal-backdrop';
      modal.innerHTML = `<section class="modal auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <div class="modal-header"><div><div class="eyebrow">YOUR DAYMARK ACCOUNT</div><h2 id="auth-title">Sign in or create an account</h2><p>Keep your profile connected.</p></div><button class="modal-close" aria-label="Close">×</button></div>
        <div class="modal-body"><button class="google-signin-button" id="auth-google" ${enabled?'':'disabled'}><span class="google-g">G</span> Continue with Google</button>
          <div class="auth-divider"><span>or use email</span></div><div class="auth-tabs"><button class="selected" type="button" data-mode="signin">Sign in</button><button type="button" data-mode="register">Create account</button></div>
          <form id="auth-form"><div class="form-field"><label for="auth-email">Gmail or email address</label><input id="auth-email" type="email" autocomplete="email" placeholder="you@gmail.com" required></div>
          <div class="form-field"><label for="auth-password">Daymark password</label><input id="auth-password" type="password" autocomplete="current-password" minlength="6" placeholder="At least 6 characters" required></div>
          <button class="primary-button auth-submit" ${enabled?'':'disabled'}>Sign in</button><button type="button" class="auth-reset" id="auth-reset">Forgot password?</button></form>
          <p class="auth-feedback" id="auth-feedback" role="status">${enabled?'Use Google to sign in with your Google account. Email sign-in uses a separate Daymark password.':'To activate accounts, connect a Firebase project in firebase-config.js and enable Google and Email/Password sign-in.'}</p>
          <p class="auth-privacy">Your routine data stays in this browser. Account sign-in does not sync it between devices.</p></div></section>`;
      document.body.append(modal);
      if(auth?.currentUser){const signout=document.createElement('button');signout.className='secondary-button';signout.textContent='Sign out';signout.style.cssText='display:block;margin:12px auto 0';signout.onclick=async()=>{await auth.signOut();modal.remove()};modal.querySelector('.modal-body').append(signout)}
      modal.querySelector('.modal-close').onclick=()=>modal.remove();
      modal.onclick=e=>{if(e.target===modal)modal.remove()};
      let mode='signin';
      modal.querySelectorAll('[data-mode]').forEach(button=>button.onclick=()=>{mode=button.dataset.mode;modal.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('selected',x===button));modal.querySelector('.auth-submit').textContent=mode==='signin'?'Sign in':'Create account';modal.querySelector('#auth-title').textContent=mode==='signin'?'Welcome back':'Create your Daymark account';modal.querySelector('#auth-password').autocomplete=mode==='signin'?'current-password':'new-password';modal.querySelector('#auth-reset').hidden=mode!=='signin'});
      const feedback=message=>modal.querySelector('#auth-feedback').textContent=message;
      modal.querySelector('#auth-google').onclick=async()=>{if(!auth)return;try{await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());modal.remove()}catch(e){feedback(e.code==='auth/unauthorized-domain'?'Add this website to Firebase Authentication → Settings → Authorized domains.':e.message)}};
      modal.querySelector('#auth-form').onsubmit=async e=>{e.preventDefault();if(!auth)return;const email=modal.querySelector('#auth-email').value.trim(),password=modal.querySelector('#auth-password').value;try{if(mode==='register')await auth.createUserWithEmailAndPassword(email,password);else await auth.signInWithEmailAndPassword(email,password);modal.remove()}catch(err){const messages={'auth/invalid-credential':'Email or password is incorrect.','auth/email-already-in-use':'An account already exists for that email.','auth/weak-password':'Use a password with at least 6 characters.','auth/invalid-email':'Enter a valid email address.'};feedback(messages[err.code]||err.message)}};
      modal.querySelector('#auth-reset').onclick=async()=>{if(!auth)return;const email=modal.querySelector('#auth-email').value.trim();if(!email){feedback('Enter your email address first.');return}try{await auth.sendPasswordResetEmail(email);feedback('Password reset instructions were sent to your email.')}catch(err){feedback(err.message)}};
    };
    const accountButton=(label='Sign in')=>{const b=document.createElement('button');b.className='account-entry';b.type='button';b.dataset.accountLabel='';b.textContent=label;b.onclick=open;return b};
    document.querySelector('.top-actions')?.prepend(accountButton(enabled?'Sign in':'Set up account'));
    const welcome=document.querySelector('.welcome-card');
    if(welcome){const b=accountButton(enabled?'Sign in or register':'Set up account');b.className='google-signin-button welcome-account';b.textContent='Continue with Google or email';welcome.querySelector('#welcome-form')?.after(b)}
    const settings=document.querySelector('.settings-grid');
    if(settings&&!document.getElementById('account-settings')){const block=document.createElement('section');block.className='settings-block account-settings';block.id='account-settings';block.innerHTML=`<h3>Your account</h3><p>Sign in with Google, or use an email and Daymark password.</p><button class="secondary-button" id="settings-account">${enabled?'Manage account':'Set up account'}</button><small>Your routines remain on this device until cloud sync is connected.</small>`;block.querySelector('button').onclick=open;settings.prepend(block)}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
