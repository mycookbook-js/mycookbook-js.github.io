import { register } from '../api/user-service.js';
import { html } from '../lib.js';
import { createSubmitHandler } from '../util.js';
import { field } from './common.js';

const registerTemplate = (onSubmit, errors, data) => html`
<section id="register">
    <article>
        <h2>Register</h2>
        <form @submit=${onSubmit} id="registerForm">
            ${errors ? html`<p class="error">${errors.message}</p>` : null}
            
            ${field({label: 'Username', name: 'username', value: data.username, error: errors.username})}
            ${field({label: 'Email', name: 'email', value: data.email, error: errors.email})}
            ${field({label: 'Password', name: 'password', type: 'password', error: errors.password})}
            ${field({label: 'Repeat Pass', name: 'repass', type: 'password', error: errors.repass})}
            <input type="submit" value="Register">
        </form>
    </article>
</section>
`;

export function registerPage(context) {
    update();

    function update(errors = {}, data = {}) {
        context.render(registerTemplate(createSubmitHandler(onSubmit, 'username', 'password'), errors, data));
    }
    
    async function onSubmit(data, event) {
        try {
            if(data.username == '' || data.password == '') {
                throw {
                    message: 'Please fill all fields.',
                    username: true,
                    password: true
                };
            }
    
            await register();
            event.target.reset();
            
            context.updateSession();
            context.updateUserNav();
            context.page.redirect('/catalog');
        } catch (error) {
            update(error, data.username);
        }
    }
}