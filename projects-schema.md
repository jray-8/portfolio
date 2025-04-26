# Projects JSON Structure

This file outlines the structure of the `projects.json` file used for displaying projects in the portfolio.

### Example Structure:
```json
[
    {
		"id": 1,
		"name": "Project 1",
		"description": "A short description of Project 1\n- bullet point",
		"techStack": ["html", "js", "css"],
		"links": 
		{
			"github": "https://github.com/user/my-repo"
		},

		"subprojects": 
		[
			{
				"name": "Subproject A",
				"description": "A short description of Subproject A",
				"preview": "http://example.com/my-project"
        	}
      	]
    }
]
```

### Root Structure

The root of the JSON file is an __array__ of __project objects__, each following the format:

- `name` (Required): The name of the project.

- `expanded` (boolean): If the project starts expanded (showing description + image).

- `techStack`: An array of __lowercase__ strings representing tools used in the project.
	- Possible values:  
	
		`python`, `jupyter`, `latex`, `js`,  
		`html`, `css`, `c`, `c++`, `julia`,  
		`numpy`, `pandas`, `matplotlib`, `plotly`,  
		`scikit-learn`, `pytorch`

- `image`: A URL or path to an image representing the project.

- `description`: A short description of the project.
	- Use `\n` to mark new paragraphs
	- And `\n-` for bullet points
	- Also supports markdown-styled `**bold**` and `_italic_` text

- `preview`: A URL to preview the project.

- `links`: Links related to the project.
	- `live`: 		URL to the project's live site.
	- `github`: 	Link to GitHub repo.
	- `gitClone`: 	Web URL to repo, which will be used to clone the project
	- `nbviewer`: 	URL to statically serve a Jupyter notebook (nbviewer.org)
	- `binder`: 	Binder link to serve a Jupyter notebook live (mybinder.org)
	- `download`: 	DownGit URL for local download (.zip)
	- `youtube`: 	Link to video demoing the project

- `subprojects`: An array of subproject objects
	- Each subproject follows the same structure as the parent project
