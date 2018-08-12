module.exports = plop => {
  plop.setGenerator('styled component', {
		description: 'Create a styled component',
		prompts: [{
			type: 'input',
			name: 'name',
			message: 'component name'
		}],
		actions: [{
			type: 'add',
			path: 'src/components/{{properCase name}}.component.js',
			templateFile: 'plop-templates/component_styled.hbs'
		}],
  });

  plop.setGenerator('function component', {
		description: 'Create a stateless React component',
		prompts: [{
			type: 'input',
			name: 'name',
			message: 'component name'
		}],
		actions: [{
			type: 'add',
			path: 'src/components/{{properCase name}}.component.js',
			templateFile: 'plop-templates/component_function.hbs'
		}],
  });

	plop.setGenerator('component', {
		description: 'Create a stateful React component',
		prompts: [{
			type: 'input',
			name: 'name',
			message: 'component name'
		}],
		actions: [{
			type: 'add',
			path: 'src/components/{{properCase name}}.component.js',
			templateFile: 'plop-templates/component_class.hbs'
		}],
	});

	plop.setGenerator('screen', {
		description: 'Create a screen component',
		prompts: [{
			type: 'input',
			name: 'name',
			message: 'screen name'
		}],
		actions: [{
			type: 'add',
			path: 'src/screens/{{properCase name}}.screen.js',
			templateFile: 'plop-templates/screen.hbs'
		}],
	});

	plop.setGenerator('model', {
		description: 'Create a mobx-state-tree model',
		prompts: [{
			type: 'input',
			name: 'name',
			message: 'model name'
		}],
		actions: [{
			type: 'add',
			path: 'src/models/{{properCase name}}.model.js',
			templateFile: 'plop-templates/model.hbs'
		}],
	});
};
