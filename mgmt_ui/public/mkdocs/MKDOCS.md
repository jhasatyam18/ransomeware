# Prerequisites

-   Install Mkdocs using command :
    pip install mkdocs

-   Install pandoc to generate markdown file of the documentation

-   Install material UI plugin for themes using command :
    pip install mkdocs-material

# Steps

-   Create a folder named Project

-   For theme place mkdocs.yml file inside project folder

-   In the folder project create another folder named docs

-   Place the created markdown file of the documentation, images,stylesheet inside docs folder
 
-   Note : Markdown file name should be index.md

-   To generate Markdown file of the word document use pandoc command : 
    pandoc -f docx -t markdown_mmd --toc --toc-depth=2 --extract-media=. -s Datamotive-User-Guide_1_2.docx -o index.md

-   In markdown file (index.md) remove all content before #Introduction and add ##(double hash) to arrange table of content.

-   First, delete the docs folder and commit the changes. Then, add the new docs folder using the force add command 
    (git add -f docs), and commit it.

# Run and build the documentation

-   For seeing the documentation locally run 
    mkdocs serve 

-   To create a build run 
    mkdocs build

-   After the build, a 'site' folder will be created. Rename this folder to docs and replace the existing docs folder in your
    project with it.

-   For testing the documentation always make build from jenkins do not test it locally.