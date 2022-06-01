import { createRecipe } from '../api/recipe-service.js';
import { html } from '../lib.js';
import { createSubmitHandler } from '../util.js';
import { field } from './common.js';

const editTemplate = (onSubmit, errors, data) => html`
<section id="create">
    <article>
        <h2>Edit Recipe</h2>
        <form @submit=${onSubmit} id="createForm">
            ${errors ? html`<p class="error">${errors.message}</p>` : null}

            ${field({
                label: 'Name', 
                name: 'name', 
                value: data.name, 
                placeholder: 'Recipe name', 
                error: errors.name
            })}

            ${field({
                label: 'Image', 
                name: 'img', 
                value: data.img, 
                placeholder: 'Image URL', 
                error: errors.img
            })}

            ${field({
                label: 'Ingredients', 
                type: 'textarea', 
                name: 'ingredients', 
                value: data.ingredients, 
                placeholder: 'Enter ingredients on separate lines', 
                error: errors.ingredients
            })}

            ${field({
                label: 'Preparations', 
                type: 'textarea', 
                name: 'steps', 
                value: data.steps, 
                placeholder: 'Enter preparation steps on separate lines', 
                error: errors.steps
            })}

            <input type="submit" value="Edit Recipe">
        </form>
    </article>
</section>
`;

export function editPage(context) {
    update();

    function update(errors = {}, data = {}) {
        context.render(
                editTemplate(
                createSubmitHandler(onSubmit, 'name', 'img', 'ingredients', 'steps'), 
                errors, data
            )
        );
    }
    
    async function onSubmit(data, event) {
        try {
            const missing = Object.entries(data).filter(([k, v]) => v == '');
            
            if(missing.length > 0) {
                throw missing.reduce((a, [key]) => Object.assign(a, { [key]: true }), {message: 'Please fill all fields.'});
            }

            const recipe = {
                name: data.name,
                img: data.img,
                ingredients: data.ingredients.split('\n').filter(r => r != ''),
                steps: data.steps.split('\n').filter(r => r != '')
            };

            console.log(recipe);
    
            const result = await createRecipe(recipe);
            event.target.reset();
            
            context.page.redirect('/details/' + result.objectId);
        } catch (error) {
            update(error, data);
        }
    }
}