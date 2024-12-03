#!/bin/bash

# Get project name from cmd line
if [ -z "$1" ]; then
	echo "Error: No project name provided."
	echo "Usage: ./create-project.sh <project_name>"
	read -p "Press Enter to exit..."
	exit 1
fi

project_name="$1" # Assign the passed argument to project_name

# Define the project directory
project_dir="projects/$project_name"

if [ -d "$project_dir" ]; then
	echo "Error: Project '$project_name' already exists."
	read -p "Press Enter to exit..."
	exit 1
fi

# Create the project directory and the js/css subdirectories
mkdir -p "$project_dir/js" "$project_dir/css"

# Create a simple index.html file inside the project directory
cat > "$project_dir/index.html" <<EOL
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>$project_name</title>
</head>
<body>
</body>
</html>
EOL

# Confirmation message
echo "Project '$project_name' created at $project_dir with index.html"
read -p "Press Enter to exit..."
